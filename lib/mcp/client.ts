import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import type { RawTool } from "@/lib/dashboard/types";

/**
 * Minimal MCP client over streamable HTTP. Polyshield acts as an MCP client
 * toward every downstream server: an initialize handshake per gateway
 * request, then tools/list or tools/call. Responses may arrive as plain JSON
 * or as an SSE stream — both are handled.
 */

const PROTOCOL_VERSION = "2025-03-26";

/**
 * SSRF guard. A registered endpoint is fully user-controlled and is fetched
 * server-side by the gateway, so without this a tenant could point it at
 * internal infrastructure or cloud metadata (169.254.169.254) and use
 * Polyshield as a confused deputy. We require http(s) and refuse any host
 * that resolves to a private, loopback, or link-local address. Self-hosters
 * who genuinely run MCPs on a private network can opt out with
 * POLYSHIELD_ALLOW_PRIVATE_MCP=1.
 */
function ipIsPrivate(ip: string): boolean {
  const v = isIP(ip);
  if (v === 4) {
    const p = ip.split(".").map(Number);
    if (p.length !== 4 || p.some((n) => Number.isNaN(n))) return true;
    const [a, b] = p;
    return (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      (a === 169 && b === 254) || // link-local incl. cloud metadata
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 100 && b >= 64 && b <= 127) || // CGNAT
      a >= 224 // multicast / reserved
    );
  }
  const lower = ip.toLowerCase().replace(/^\[|\]$/g, "");
  if (lower === "::1" || lower === "::") return true;
  if (lower.startsWith("fe80") || lower.startsWith("fc") || lower.startsWith("fd")) return true;

  if (v !== 6) return false;

  let segments = lower.split(":");

  // Handle mapped IPv4 at the end (e.g. ::ffff:127.0.0.1)
  if (segments[segments.length - 1].includes(".")) {
    const p = (segments.pop() as string).split(".").map(Number);
    segments.push(((p[0] << 8) | p[1]).toString(16), ((p[2] << 8) | p[3]).toString(16));
  }

  // Handle zero compression (::)
  const emptyIdx = segments.indexOf("");
  if (emptyIdx !== -1) {
    const before = segments.slice(0, emptyIdx).filter(Boolean);
    const after = segments.slice(emptyIdx + 1).filter(Boolean);
    segments = [...before, ...Array(8 - before.length - after.length).fill("0"), ...after];
  }

  while (segments.length < 8) segments.unshift("0");
  const n = segments.map((s) => parseInt(s || "0", 16));

  // Check loopback (0:0:0:0:0:0:0:1) and unspecified (0:0:0:0:0:0:0:0)
  // Check IPv4-mapped IPv6 (0:0:0:0:0:ffff:x:x)
  if (n[0] === 0 && n[1] === 0 && n[2] === 0 && n[3] === 0 && n[4] === 0) {
    if (n[5] === 0 && n[6] === 0 && (n[7] === 0 || n[7] === 1)) return true;
    if (n[5] === 0xffff) return ipIsPrivate(`${n[6] >> 8}.${n[6] & 255}.${n[7] >> 8}.${n[7] & 255}`);
  }

  return false;
}

async function assertPublicUrl(endpoint: string): Promise<void> {
  if (process.env.POLYSHIELD_ALLOW_PRIVATE_MCP === "1") return;
  let url: URL;
  try {
    url = new URL(endpoint);
  } catch {
    throw new McpClientError("Invalid endpoint URL.");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new McpClientError("Only http(s) MCP endpoints are allowed.");
  }
  const host = url.hostname.replace(/^\[|\]$/g, "");
  if (host.toLowerCase() === "localhost") {
    throw new McpClientError("Endpoint host is not permitted.");
  }
  if (isIP(host)) {
    if (ipIsPrivate(host)) throw new McpClientError("Endpoint host is not permitted.");
    return;
  }
  let addresses: Array<{ address: string }>;
  try {
    addresses = await lookup(host, { all: true });
  } catch {
    throw new McpClientError("Could not resolve the MCP server host.");
  }
  if (addresses.length === 0 || addresses.some((a) => ipIsPrivate(a.address))) {
    throw new McpClientError("Endpoint host is not permitted.");
  }
}

interface JsonRpcMessage {
  jsonrpc: "2.0";
  id?: number | string;
  result?: unknown;
  error?: { code: number; message: string; data?: unknown };
}

export interface McpContentBlock {
  type: string;
  text?: string;
  [key: string]: unknown;
}

export interface McpToolResult {
  content: McpContentBlock[];
  structuredContent?: unknown;
  isError?: boolean;
}

export class McpClientError extends Error {}

/**
 * Render an endpoint as host-only for error messages. Full URLs can carry a
 * token in the query string; messages surface to the agent and audit log, so
 * never echo more than the origin.
 */
function safeHost(endpoint: string): string {
  try {
    return new URL(endpoint).host;
  } catch {
    return "the MCP server";
  }
}

async function parseResponse(res: Response, id: number): Promise<JsonRpcMessage> {
  const contentType = res.headers.get("content-type") ?? "";
  const text = await res.text();
  if (contentType.includes("text/event-stream")) {
    for (const event of text.split(/\r?\n\r?\n/)) {
      const data = event
        .split(/\r?\n/)
        .filter((line) => line.startsWith("data:"))
        .map((line) => line.slice(5).trim())
        .join("\n");
      if (!data) continue;
      try {
        const msg = JSON.parse(data) as JsonRpcMessage;
        if (msg.id === id && ("result" in msg || "error" in msg)) return msg;
      } catch {
        // non-JSON keepalive or partial event — keep scanning
      }
    }
    throw new McpClientError("No JSON-RPC response found in SSE stream");
  }
  if (!text) throw new McpClientError("Empty response body");
  let parsed: JsonRpcMessage | JsonRpcMessage[];
  try {
    parsed = JSON.parse(text) as JsonRpcMessage | JsonRpcMessage[];
  } catch {
    throw new McpClientError("Malformed JSON-RPC response from the MCP server");
  }
  const msg = Array.isArray(parsed) ? parsed.find((m) => m.id === id) : parsed;
  if (!msg) throw new McpClientError("No matching JSON-RPC response");
  return msg;
}

export class McpHttpClient {
  private sessionId: string | null = null;
  private protocolVersion = PROTOCOL_VERSION;
  private nextId = 1;
  private urlVerified = false;

  constructor(
    private endpoint: string,
    private authHeader?: string,
  ) {}

  private headers(): Record<string, string> {
    const h: Record<string, string> = {
      "content-type": "application/json",
      accept: "application/json, text/event-stream",
      "mcp-protocol-version": this.protocolVersion,
    };
    if (this.authHeader) h.authorization = this.authHeader;
    if (this.sessionId) h["mcp-session-id"] = this.sessionId;
    return h;
  }

  private async post(payload: unknown, timeoutMs: number): Promise<Response> {
    // Validate once per client; the endpoint is fixed for its lifetime.
    if (!this.urlVerified) {
      await assertPublicUrl(this.endpoint);
      this.urlVerified = true;
    }
    try {
      return await fetch(this.endpoint, {
        method: "POST",
        headers: this.headers(),
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(timeoutMs),
      });
    } catch (err) {
      throw new McpClientError(
        err instanceof Error && err.name === "TimeoutError"
          ? `Timed out reaching ${safeHost(this.endpoint)}`
          : `Could not reach ${safeHost(this.endpoint)}`,
      );
    }
  }

  private async request<T>(method: string, params: unknown, timeoutMs: number): Promise<T> {
    const id = this.nextId++;
    const res = await this.post({ jsonrpc: "2.0", id, method, params }, timeoutMs);
    if (!res.ok) {
      throw new McpClientError(`${method} → HTTP ${res.status} from ${safeHost(this.endpoint)}`);
    }
    const msg = await parseResponse(res, id);
    if (msg.error) {
      throw new McpClientError(`${method} → ${msg.error.message} (code ${msg.error.code})`);
    }
    return msg.result as T;
  }

  /** initialize + initialized notification. Call once before list/call. */
  async connect(timeoutMs = 15_000): Promise<void> {
    const id = this.nextId++;
    const res = await this.post(
      {
        jsonrpc: "2.0",
        id,
        method: "initialize",
        params: {
          protocolVersion: PROTOCOL_VERSION,
          capabilities: {},
          clientInfo: { name: "polyshield-gateway", version: "0.1.0" },
        },
      },
      timeoutMs,
    );
    if (!res.ok) {
      throw new McpClientError(`initialize → HTTP ${res.status} from ${safeHost(this.endpoint)}`);
    }
    this.sessionId = res.headers.get("mcp-session-id");
    const msg = await parseResponse(res, id);
    if (msg.error) {
      throw new McpClientError(`initialize → ${msg.error.message}`);
    }
    const negotiated = (msg.result as { protocolVersion?: string } | undefined)?.protocolVersion;
    if (negotiated) this.protocolVersion = negotiated;
    // Required by spec before normal requests; some servers ignore it.
    await this.post({ jsonrpc: "2.0", method: "notifications/initialized" }, 10_000).catch(
      () => {},
    );
  }

  async listTools(timeoutMs = 20_000): Promise<RawTool[]> {
    const tools: RawTool[] = [];
    const seenCursors = new Set<string>();
    let cursor: string | undefined;
    // Hard page bound + repeated-cursor detection guard against a downstream
    // that returns a non-advancing cursor (infinite loop) or paginates
    // forever; the 500-tool cap alone fails when pages return zero tools.
    for (let page = 0; page < 50; page++) {
      const result = await this.request<{
        tools?: Array<{
          name: string;
          description?: string;
          inputSchema?: Record<string, unknown>;
        }>;
        nextCursor?: string;
      }>("tools/list", cursor ? { cursor } : {}, timeoutMs);
      for (const t of result.tools ?? []) {
        tools.push({
          name: t.name,
          description: t.description ?? "",
          inputSchema: t.inputSchema ?? { type: "object", properties: {} },
        });
      }
      cursor = result.nextCursor;
      if (!cursor || tools.length >= 500 || seenCursors.has(cursor)) break;
      seenCursors.add(cursor);
    }
    return tools;
  }

  async callTool(
    name: string,
    args: Record<string, unknown>,
    timeoutMs = 60_000,
  ): Promise<McpToolResult> {
    const result = await this.request<McpToolResult>(
      "tools/call",
      { name, arguments: args },
      timeoutMs,
    );
    return {
      content: Array.isArray(result?.content) ? result.content : [],
      structuredContent: result?.structuredContent,
      isError: result?.isError === true,
    };
  }
}

/** Handshake + tools/list in one shot — used when registering a server. */
export async function discoverHttpTools(
  endpoint: string,
  authHeader?: string,
): Promise<RawTool[]> {
  const client = new McpHttpClient(endpoint, authHeader);
  await client.connect();
  return client.listTools();
}

/**
 * Cap a stored tool result so a huge downstream payload can't bloat audit
 * rows. Each text block is trimmed to maxChars independently (so a later
 * block is never erased by an earlier large one), and oversized
 * structuredContent is replaced with a capped preview. isError and other
 * block types pass through unchanged.
 */
export function truncateToolResult(result: McpToolResult, maxChars = 20_000): McpToolResult {
  const content = result.content.map((block) => {
    if (typeof block.text !== "string" || block.text.length <= maxChars) return block;
    return { ...block, text: `${block.text.slice(0, maxChars)}… [truncated by Polyshield]` };
  });

  let structuredContent = result.structuredContent;
  if (structuredContent !== undefined && structuredContent !== null) {
    const json = JSON.stringify(structuredContent);
    if (json && json.length > maxChars) {
      structuredContent = { _truncated: true, preview: json.slice(0, maxChars) };
    }
  }

  return { ...result, content, structuredContent };
}
