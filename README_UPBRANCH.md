# Upbranch

Learn AI. Build what's next.

Upbranch adds a public AI literacy experience to the existing PolyShield application. Anonymous learners can complete branching, authored simulations, explore three learning paths, browse ten educational project briefs, and inspect five source-linked research cards.

## Run locally

Requires Node.js 24 and npm. From this directory:

```sh
npm ci
npm run dev
```

Open `http://localhost:3000`. Learning routes need no account or API keys. Existing developer account pages require the original Supabase setup. For a local build check only, non-production placeholder Supabase URL/key values are sufficient; they do not enable account sign-in. Never use placeholders as a production auth configuration.

```sh
npm run typecheck
npm run test:upbranch
npm run test:security
npm run lint
npm run build
```

The production build needs `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` because the inherited sign-in pages initialize a client while rendering. Keep environment values outside Git.

## Try the product

- `/learn/first-agent`: six core decisions, an alternate remediation branch, feedback, a scripted workspace, permission fixture and transfer scenario. Progress resumes in this browser; reset clears that mission's completion state.
- `/learn`: three playable simulations and three clearly marked future lessons.
- `/paths`: three pathway previews with browser-local completion markers.
- `/discover`: searchable project ideas and detailed briefs; all are unpaid educational challenges.
- `/portfolio`: local evidence checklist, export and reset.
- `/radar`: five metadata-checked sources in the static October 26, 2026 curated edition.
- `/studio`: read-only preview; editing and execution are future work.

All mission output is simulated. No live model, shell, arbitrary execution, external runner, learner data upload or automatic research ingestion is included. Existing PolyShield dashboard, gateway, API, auth, billing and database migrations remain intact.

See `docs/upbranch/VALIDATION.md` for executed checks and limits, `docs/upbranch/THIRD_PARTY.md` for attribution, and `docs/upbranch/RELEASE_CHECKLIST.md` for a demonstration script. AI-assisted development and source reuse must be described honestly in any competition submission. A prepared build or demo does not establish portal submission acceptance.
