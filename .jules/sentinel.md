## 2026-06-19 - Error Leakage in JSON-RPC API
**Vulnerability:** The MCP gateway's fallback error handler passed the raw `err.message` to the agent, which could leak internal infrastructure details, database query details, or other sensitive downstream information on unhandled failures.
**Learning:** Returning `err.message` is inherently unsafe in a public or untrusted-client API context because the originating error is often outside our control and may not be sanitized.
**Prevention:** Always use static, predefined generic error strings for generic server failure states (e.g. "Internal server error") and rely on backend logs and dashboard audit trails for debugging.
