"use client";

import { useEffect, useState, useTransition } from "react";
import { Check, KeyRound, Loader2, ShieldCheck, Slack, Sparkles } from "lucide-react";
import DOMPurify from "dompurify";
import { createClient } from "@/lib/supabase/client";
import {
  openBillingPortalAction,
  startCheckoutAction,
} from "@/app/dashboard/billing-actions";
import { setPrivacyModeAction, setSlackWebhookAction } from "@/app/dashboard/actions";
import { GlassCard } from "@/components/dashboard/primitives";
import { BILLING_TIERS } from "@/lib/billing/plans";
import type { Plan } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils";

// ---------- Billing ----------

export function BillingPanel({
  plan,
  hasBilling,
  periodEnd,
}: {
  plan: Plan;
  hasBilling: boolean;
  periodEnd: number | null;
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function checkout(target: Plan) {
    setError(null);
    start(async () => {
      const r = await startCheckoutAction(target);
      if (r.error) return setError(r.error);
      if (r.url) window.location.href = r.url;
    });
  }
  function portal() {
    setError(null);
    start(async () => {
      const r = await openBillingPortalAction();
      if (r.error) return setError(r.error);
      if (r.url) window.location.href = r.url;
    });
  }

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-foreground">Plan &amp; billing</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            You&apos;re on the <span className="font-semibold capitalize text-foreground">{plan}</span> plan
            {periodEnd ? ` · renews ${new Date(periodEnd).toLocaleDateString()}` : ""}.
          </p>
        </div>
        {hasBilling ? (
          <button
            type="button"
            onClick={portal}
            disabled={pending}
            className="rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-ink/5 disabled:opacity-60"
          >
            Manage billing
          </button>
        ) : null}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {BILLING_TIERS.map((tier) => {
          const current = tier.plan === plan;
          return (
            <div
              key={tier.plan}
              className={cn(
                "flex flex-col rounded-2xl border p-4",
                current ? "border-violet/40 bg-violet/[0.04]" : "border-ink/10",
              )}
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold text-foreground">{tier.name}</p>
                {current ? (
                  <span className="rounded-full bg-violet/10 px-2 py-0.5 text-[11px] font-semibold text-violet">
                    current
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-lg font-semibold text-foreground">{tier.priceLabel}</p>
              <p className="mt-1 text-xs text-muted-foreground">{tier.blurb}</p>
              <ul className="mt-3 flex-1 space-y-1.5">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-1.5 text-xs text-foreground/75">
                    <Check className="mt-0.5 h-3 w-3 shrink-0 text-violet" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                {current ? (
                  <span className="block text-center text-xs text-muted-foreground">Your plan</span>
                ) : tier.cta === "contact" ? (
                  <a
                    href="mailto:hello@polyshield.ai?subject=Polyshield%20Enterprise"
                    className="block rounded-full border border-ink/15 py-2 text-center text-sm font-semibold text-foreground transition-colors hover:bg-ink/5"
                  >
                    Contact us
                  </a>
                ) : tier.cta === "checkout" ? (
                  <button
                    type="button"
                    onClick={() => checkout(tier.plan)}
                    disabled={pending}
                    className="w-full rounded-full bg-violet py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-deep disabled:opacity-60"
                  >
                    Upgrade
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
      {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
    </GlassCard>
  );
}

// ---------- 2FA (TOTP) + passkey beta ----------

interface Factor {
  id: string;
  friendly_name?: string | null;
}

export function MfaPanel() {
  const supabase = createClient();
  const [factors, setFactors] = useState<Factor[] | null>(null);
  const [enroll, setEnroll] = useState<{ factorId: string; qr: string } | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [passkeyMsg, setPasskeyMsg] = useState<string | null>(null);

  async function refresh() {
    const { data } = await supabase.auth.mfa.listFactors();
    setFactors(data?.totp ?? []);
  }
  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function startEnroll() {
    setMsg(null);
    setBusy(true);
    const { data, error } = await supabase.auth.mfa.enroll({ factorType: "totp" });
    setBusy(false);
    if (error) return setMsg(error.message);
    setEnroll({ factorId: data.id, qr: data.totp.qr_code });
  }

  async function verify() {
    if (!enroll) return;
    setBusy(true);
    setMsg(null);
    const { error } = await supabase.auth.mfa.challengeAndVerify({
      factorId: enroll.factorId,
      code,
    });
    setBusy(false);
    if (error) return setMsg(error.message);
    setEnroll(null);
    setCode("");
    setMsg("Two-factor authentication is on.");
    refresh();
  }

  async function remove(factorId: string) {
    setBusy(true);
    await supabase.auth.mfa.unenroll({ factorId });
    setBusy(false);
    refresh();
  }

  async function addPasskey() {
    setPasskeyMsg(null);
    const auth = supabase.auth as unknown as { registerPasskey?: () => Promise<{ error?: { message: string } }> };
    if (typeof auth.registerPasskey !== "function") {
      setPasskeyMsg("Passkeys are in beta and not enabled on this deployment yet.");
      return;
    }
    try {
      const { error } = await auth.registerPasskey();
      setPasskeyMsg(error ? error.message : "Passkey registered.");
    } catch {
      setPasskeyMsg("Could not register a passkey (beta).");
    }
  }

  const hasMfa = (factors?.length ?? 0) > 0;

  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-violet" aria-hidden="true" />
        <h2 className="font-semibold text-foreground">Two-factor authentication</h2>
        {hasMfa ? (
          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
            on
          </span>
        ) : null}
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Protect your account with an authenticator app (TOTP). Required to act on sensitive operations.
      </p>

      {enroll ? (
        <div className="mt-4 rounded-xl border border-ink/10 p-4">
          <p className="text-sm font-medium text-foreground">Scan with your authenticator app</p>
          <div
            className="mt-3 inline-block rounded-lg bg-white p-2"
            // qr_code is an SVG string returned by Supabase
            // Security: Sanitize external SVG to prevent XSS before injecting into DOM
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(enroll?.qr || "") }}
          />
          <div className="mt-3 flex gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              inputMode="numeric"
              placeholder="6-digit code"
              className="w-40 rounded-lg border border-ink/10 bg-white px-3 py-2 font-mono text-sm outline-none focus:border-violet/40 focus:ring-4 focus:ring-violet/10"
            />
            <button
              type="button"
              onClick={verify}
              disabled={busy || code.length < 6}
              className="rounded-full bg-violet px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-deep disabled:opacity-60"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & enable"}
            </button>
            <button
              type="button"
              onClick={() => setEnroll(null)}
              className="rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-foreground hover:bg-ink/5"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {factors?.map((f) => (
            <span
              key={f.id}
              className="inline-flex items-center gap-2 rounded-full bg-ink/[0.04] px-3 py-1.5 text-sm text-foreground/80"
            >
              <KeyRound className="h-3.5 w-3.5" aria-hidden="true" />
              {f.friendly_name || "Authenticator"}
              <button
                type="button"
                onClick={() => remove(f.id)}
                className="text-xs text-rose-600 hover:underline"
              >
                remove
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={startEnroll}
            disabled={busy}
            className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-plum disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add authenticator app"}
          </button>
          <button
            type="button"
            onClick={addPasskey}
            className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-ink/5"
          >
            <Sparkles className="h-3.5 w-3.5 text-violet" aria-hidden="true" />
            Add passkey (beta)
          </button>
        </div>
      )}
      {msg ? <p className="mt-3 text-sm text-emerald-700">{msg}</p> : null}
      {passkeyMsg ? <p className="mt-2 text-sm text-muted-foreground">{passkeyMsg}</p> : null}
    </GlassCard>
  );
}

// ---------- Privacy mode ----------

export function PrivacyPanel({ initialEnabled }: { initialEnabled: boolean }) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [pending, start] = useTransition();

  return (
    <GlassCard className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold text-foreground">Offline / privacy mode</h2>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            When on, tool arguments and results are stripped before anything is written to the audit
            log — only the tool name, the decision, and byte sizes are kept. Your file contents,
            diffs, and query results are never stored in our database. Policies, approvals, and the
            shield still run on the live call; only the saved record is redacted.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          disabled={pending}
          onClick={() =>
            start(async () => {
              const next = !enabled;
              setEnabled(next);
              await setPrivacyModeAction(next);
            })
          }
          className={cn(
            "relative mt-1 inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-60",
            enabled ? "bg-violet" : "bg-ink/15",
          )}
        >
          <span
            className={cn(
              "inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow transition-transform",
              enabled ? "translate-x-[22px]" : "translate-x-1",
            )}
          />
        </button>
      </div>
    </GlassCard>
  );
}

// ---------- Connections (Slack) ----------

export function ConnectionsPanel({ slackConfigured }: { slackConfigured: boolean }) {
  const [url, setUrl] = useState("");
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  const [configured, setConfigured] = useState(slackConfigured);

  function save(clear = false) {
    setMsg(null);
    start(async () => {
      const r = await setSlackWebhookAction(clear ? "" : url);
      if (r.error) return setMsg(r.error);
      setConfigured(!clear);
      setUrl("");
      setMsg(clear ? "Slack disconnected." : "Slack connected — pending approvals will notify your channel.");
    });
  }

  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-2">
        <Slack className="h-4 w-4 text-violet" aria-hidden="true" />
        <h2 className="font-semibold text-foreground">Connections</h2>
        {configured ? (
          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
            Slack connected
          </span>
        ) : null}
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Paste a Slack incoming-webhook URL to get a notification (with a link) whenever an agent
        action is held for approval.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://hooks.slack.com/services/…"
          className="min-w-0 flex-1 rounded-lg border border-ink/10 bg-white px-3 py-2 font-mono text-sm outline-none focus:border-violet/40 focus:ring-4 focus:ring-violet/10"
        />
        <button
          type="button"
          onClick={() => save(false)}
          disabled={pending || !url.trim()}
          className="rounded-full bg-violet px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-deep disabled:opacity-60"
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Connect"}
        </button>
        {configured ? (
          <button
            type="button"
            onClick={() => save(true)}
            disabled={pending}
            className="rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-foreground hover:bg-ink/5"
          >
            Disconnect
          </button>
        ) : null}
      </div>
      {msg ? <p className="mt-2 text-sm text-muted-foreground">{msg}</p> : null}
    </GlassCard>
  );
}
