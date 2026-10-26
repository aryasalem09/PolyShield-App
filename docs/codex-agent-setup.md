# Upbranch agent setup

Assessed 2026-10-26 against baseline `3f3a7a0b624dcabd594684b9d0cee5acbfa802bb`.

This is an existing Next.js 15 / React 19 / TypeScript / Tailwind / Supabase app. The new public learning surface uses authored content, pure simulations and browser-local progress. Existing gateway, dashboard, database migrations and auth remain separate.

Six implementation/QA lanes use isolated Git worktrees: core with curriculum, frontend, labs, discovery, radar, QA. Read-only discovery precedes implementation; independent review and browser testing precede release. Concurrency is capped at seven including the parent; depth one is an assignment policy. The project config uses `agents.max_concurrent_threads_per_session`; unsupported depth/runtime keys were removed.

Requested routing: discovery Luna Medium; core, frontend, discovery and radar Terra Medium; runtime and QA Terra High; final review Sol High. Agent runtime responses do not expose verified effective model/effort, so routing is unverified. No model-savings claims are made.

Setup backups are retained outside the deliverable in `work/bootstrap-backup`. No credentials or environment values belong in source or test artifacts. Required commands and completion criteria are in `AGENTS.md`. Deploy a tested isolated preview before any production promotion. Future Worktree handoff, sandboxed IDE, ingestion and account persistence require separate implementation and review.

Retained project roles are `.codex/agents/gateway_security_reviewer.toml` and `.codex/agents/db_migration_reviewer.toml`. Use them for gateway policy/SSRF/vault reviews and migration/RLS/grant reviews respectively. The existing custom agents and their instructions are unchanged. Existing global roles remain appropriate for repository discovery, implementation, testing, documentation and release review.

Keep batch fanout for independent migration, gateway, test-inventory or component checks; a single copy/style change does not justify a team. Gateway policy regressions, Supabase RLS/grant changes and real service credential use remain the principal inherited risks. A deployment should use reviewed code and the intended configured environment; local test values do not establish that real account sign-in works.
