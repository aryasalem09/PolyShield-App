# Upbranch release checklist

Record the tested commit, date, environment, command output and evidence links beside each check. An unchecked item is not a pass.

- [ ] Run `node --experimental-strip-types --test tests/upbranch/*.test.mjs`, `npm run typecheck`, `npm run test:security`, and `npm run build` on the integrated commit. Record any existing `next lint` incompatibility separately.
- [ ] In a fresh private browser without an account or API key, open the main navigation and each CTA. Complete the first-agent mission along different branches, review feedback, refresh and check saved progress and reset.
- [ ] Display three pathways, mark unfinished lessons clearly, and check at least six unpaid project ideas and their external resource links.
- [ ] Check at least five Radar items against their canonical source, original date, and review status. Verify the UI describes a curated feed unless ingestion is actually running.
- [ ] Verify the original dashboard sign-in and existing gateway security checks in an appropriate test environment, without production secrets. Confirm no new learner route accesses privileged dashboard state or `/api/mcp`.
- [ ] Keyboard test navigation, selection, focus indicators, labels and errors. Check 375px reflow, contrast and reduced motion. Record browser and assistive technology used; this checklist alone is not an accessibility audit.
- [ ] Verify privacy copy and appropriate guidance for minors; inspect client output for secrets and ensure no generic remote executor is exposed.
- [ ] In an isolated HTTPS preview, check public routes for 500 responses, page titles and social metadata, and prevent indexing of private dashboard content.
- [ ] Complete third-party notices and disclose actual AI assistance according to submission rules. Review current direct and transitive licenses and any separate provider/runtime terms.
- [ ] Record a 1–3 minute demonstration of the features actually working, using the script below as a guide. Verify the submission portal confirms acceptance; a prepared script is not a recording or submission.

## Demo script (about 90 seconds; adapt to the verified build)

1. **0:00–0:15** Introduce Upbranch as a learning experience for understanding and working responsibly with AI. State that this demonstration uses authored simulations.
2. **0:15–0:50** Open the first-agent mission. Choose a brief, show its feedback and resulting branch, then complete the remaining decisions. Show the outcome and explain that the score is based on authored choices, not a live AI evaluation.
3. **0:50–1:10** Show the pathways and a project idea; follow a resource link and explain that project ideas are not paid opportunities.
4. **1:10–1:25** Open Radar and show the source and date on a curated item. Do not call the feed live unless the integrated build actually ingests updates.
5. **1:25–1:30** State what was built and acknowledge the actual contributors and AI assistance. Only show or claim features verified in the running build.
