# Coding Agent Instructions

## Operating Principles

Keep it simple. Simple is better than complex.
Assume the user is a principal engineer.
Make the smallest maintainable change that solves the actual request.
Prefer existing patterns over new abstractions.
Avoid broad refactors, speculative helpers, and clever architecture unless clearly justified.
Use judgment. Read enough surrounding code to understand the existing pattern, then avoid unnecessary exploration.
Optimize for correctness, speed, judgment, and token efficiency.
Correct the user when appropriate.
Prefer FAANG-level code quality: clear naming, strong types, simple control flow, minimal mutation, focused functions, pure functions/components where practical, and no unnecessary abstraction.

## Context Discipline

Protect context aggressively.

Answer the narrow question first. Inspect the smallest relevant file, symbol, route, component, diff, log, or test output.

Prefer targeted searches, focused file sections, nearby call sites, capped logs, and scoped validation. Avoid running validation commands like `npm run build`, `npm run test`, or `npm run lint` unless absolutely necessary. Use normal scoped commands like `rg`, with a byte cap when needed.

Avoid dumping full files, full logs, unrelated directories, broad repo searches, large diffs, or generated output after the relevant code is found.

Do not byte-cap instruction files, skill files, tool docs, or agent policy files. Read the whole relevant file unless it is unexpectedly huge.

## Command Output

Protect context usage. **Any command with unknown or potentially large output must be scoped and byte-capped.**

Byte-cap unknown or potentially large output. Line caps alone are unsafe because a single line can be huge.

```bash
COMMAND 2>&1 | head -c 4000
COMMAND 2>&1 | tail -c 4000
```

### Good Byte Capping Examples

```bash
rg -n -m 20 'functionName|ComponentName|routeName' src 2>&1 | head -c 200
bash -o pipefail -c 'npm run type-check 2>&1 | tail -c 500'
bash -o pipefail -c 'npm run test 2>&1 | tail -c 2000'
bash -o pipefail -c 'npm run build 2>&1 | tail -c 500'
rg -l "SEARCH_TERM" src 2>&1 | head -c 4000
```

Do not rely on `head -n`, `tail -n`, or `sed -n` as the only cap.

Scope before printing content: list files first, search specific paths, count matches when useful, and avoid reading generated, binary, minified, database, or huge JSON/JSONL files unless required.

Preserve exit codes when needed:

```bash
tmp="$(mktemp)"
COMMAND >"$tmp" 2>&1
status=$?
tail -c 5000 "$tmp"
rm -f "$tmp"
exit "$status"
```

Avoid unbounded `cat`, broad `rg`, `find`, `ls -R`, `git diff`, tests, builds, and `select *`.

If capped output is insufficient, narrow the command before increasing the cap.

## Code Changes

Prefer direct edits with the available patch tool.
Patch the narrow failing path first.
Avoid unrelated cleanup.
Do not add helpers, wrappers, maps, files, abstractions, or validation layers unless they clearly reduce complexity.

## Patterns to Avoid

Avoid single-use abstractions.

Prefer inline types and direct logic when a helper, wrapper, map, or named type is used only once.

Avoid wrapper functions that simply call another function.

## Validation

Match validation to risk.

Skip validation for low-risk changes and say so plainly.
Use the cheapest useful check for risky changes.
Do not run full test suites or full builds unless risk justifies it or the user asks.

## Subagents

Use subagents only when they save context, save time, or materially improve output quality.

For research, review, and exploration tasks, avoid confirmation bias. Do not pass a preferred conclusion. Ask the subagent to investigate, compare, or verify, and require evidence, tradeoffs, uncertainty, and better alternatives.

Prefer subagents for:

- documentation/API checks
- web research
- non-trivial copywriting/content generation

Avoid subagents for trivial work the main agent can finish faster.

When using a subagent, assign a narrow task and require:

- findings
- files inspected
- files changed, if any
- validation run, if any
- risks or uncertainty

You own final judgment and integration.

## Communication

Before editing, state the approach only for non-trivial tasks.

During complex work, keep updates short:

- what was found
- what changed
- what risk remains

After work, summarize:

- what changed
- files touched
- validation run, or why skipped
- remaining risk

Keep summaries short. Do not explain obvious edits.

Oververbosity:low

## Codex Subagent Policy

- Codex should use parallel subagents for nontrivial work when there are independent workstreams.
- Fanout must be justified by independent workstreams; prefer 4-8 agents for normal tasks.
- Use 8-12 only for large independent modules, audits, migrations, security sweeps, or test/review passes.
- Do not spawn agents that edit the same file at the same time.
- Keep `max_depth = 1` unless the repo-specific config explains why `2` is justified.
- Always use a read-only scout before major edits.
- Always use independent tester/reviewer agents before claiming completion.
- Use CSV fanout for repeated independent tasks like migration reviews, gateway module audits, policy-test sweeps, or component checks.

## Codex Project Profile

- Purpose: PolyShield web app and gateway surface for AI/tool-call security, audit, policy, and billing workflows.
- Stack: Next.js, TypeScript, Tailwind/shadcn-style components, Supabase migrations, and Node test scripts.
- Important directories: `app/`, `components/`, `lib/gateway/`, `lib/notify/`, `scripts/`, `supabase/migrations/`, and `docs/`.
- Commands discovered: `npm run dev`, `npm run build`, `npm run lint`, `npm run typecheck`, and `npm run test:security`.
- Recommended roles: `repo_scout`, `architect`, `gateway_security_reviewer`, `db_migration_reviewer`, `implementer`, `tester`, `reviewer`, `security_auditor`, and `release_manager`.
- Never use real production Supabase, Slack, billing, or provider credentials without explicit approval.

## Upbranch public learning surface (2026-10-26)

- Upbranch adds anonymous authored learning to the existing PolyShield Next.js 15 / React 19 application. Preserve the developer dashboard, authentication, gateway, billing, and migrations.
- Public modules: `lib/upbranch/` (contracts, catalog, validated browser progress, deterministic runtime), `components/upbranch/`, and routes `/learn`, `/labs`, `/studio`, `/paths`, `/discover`, `/portfolio`, `/radar`.
- Ownership: core/curriculum, frontend/shared shell, labs/runtime, discovery, radar, and QA are independent lanes. Use isolated worktrees for writers; only the integration lead changes dependencies and cross-owner integration.
- Install: `npm ci`. Run: `npm run dev`. Required release checks: `npm run typecheck`, `npm run test:security`, `npm run test:upbranch`, `npm run build`, `git diff --check`, and browser mission completion/reset plus mobile navigation. Existing `npm run lint` uses legacy `next lint`; report incompatibility rather than claiming it passed.
- All R0 lessons and project briefs are authored fixtures; Radar is a dated curated edition. Mark future features explicitly. Do not claim live model execution, automatic ingestion, validated learning outcomes, or paid opportunities.
- Store anonymous progress under `upbranch:progress:v1`, bounded and schema-validated. No personal information, credentials, production database writes, arbitrary execution, or learner-supplied URL requests.
- Reuse installed React/Tailwind/Lucide; preserve third-party notices. No browser IDE/runtime is shipped in R0.
- Concurrency ceiling is seven, depth one by policy; no grandchildren. Route bounded implementation to Terra Medium, difficult runtime/QA to Terra High, and independent final review to Sol High. Effective routing must be reported as unverified unless runtime metadata proves it.
- Done means one branching mission completes anonymously, three path previews, at least six project briefs, sourced Radar, unchanged gateway/auth boundaries, and executed release checks. A demo script does not prove a video or contest submission exists.
