import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { missions } from '../../lib/upbranch/content/missions.ts';
import { pathways } from '../../lib/upbranch/pathways/catalog.ts';
import { bounties } from '../../lib/upbranch/bounties/catalog.ts';
import { radarItems } from '../../lib/upbranch/radar/catalog.ts';
import { startMission, chooseMissionAnswer, reviewMissionRun } from '../../lib/upbranch/runtime/engine.ts';
import { readLocalProgress, writeLocalProgress, resetLocalProgress } from '../../lib/upbranch/progress.ts';
import { rankBounties } from '../../lib/upbranch/pathways/match.ts';

const skills = new Set(['ai-basics','prompting','context','delegation','verification','agent-tools','least-privilege','privacy','research-literacy','evaluation','coding-agents','responsible-ai']);
const id = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const date = value => typeof value === 'string' && /^\d{4}-\d\d-\d\d(?:T.*Z)?$/.test(value) && Number.isFinite(Date.parse(value));
const link = value => { const url = new URL(value); assert.ok(['http:', 'https:'].includes(url.protocol)); assert.equal(url.username + url.password, ''); };
const unique = (values, label) => { assert.equal(new Set(values).size, values.length, `duplicate ${label}`); for (const value of values) assert.match(value, id); };
const missionIds = new Set(missions.map(m => m.id));
const bountyIds = new Set(bounties.map(b => b.id));

test('catalog IDs, references, links, scoring and every mission branch terminate', () => {
  unique([...missionIds, ...pathways.map(p => p.id), ...bountyIds, ...radarItems.map(r => r.id)], 'catalog ID');
  unique(missions.map(m => m.id), 'mission ID'); unique(bounties.map(b => b.id), 'bounty ID');
  assert.ok(missions.some(m => m.id === 'first-agent' && m.published));
  for (const m of missions) {
    if (m.published) assert.ok(m.steps.length, `${m.id} must have steps`); unique(m.steps.map(s => s.id), `${m.id} step ID`);
    m.skillIds.forEach(s => assert.ok(skills.has(s), s));
    m.prerequisiteMissionIds.forEach(ref => assert.ok(missionIds.has(ref), ref)); m.sourceUrls.forEach(link);
    const active = new Set(), done = new Set();
    function visit(index) {
      if (index === m.steps.length) return;
      assert.ok(index >= 0 && index < m.steps.length, `unknown transition in ${m.id}`);
      assert.ok(!active.has(index), `cycle in ${m.id}`); if (done.has(index)) return;
      active.add(index); const step = m.steps[index]; assert.ok(step.choices.length);
      unique(step.choices.map(c => c.id), `${m.id}/${step.id} choice ID`);
      for (const c of step.choices) {
        assert.ok(Number.isInteger(c.score) && c.score >= 0 && c.score <= 3);
        for (const [skill, evidence] of Object.entries(c.skillEvidence)) { assert.ok(skills.has(skill), skill); assert.ok(Number.isFinite(evidence)); }
        const next = c.nextStepId === undefined ? index + 1 : m.steps.findIndex(s => s.id === c.nextStepId);
        visit(next);
      }
      active.delete(index); done.add(index);
    }
    for (let i = 0; i < m.steps.length; i++) visit(i);
  }
  for (const p of pathways) { p.missionIds.forEach(ref => assert.ok(missionIds.has(ref), ref)); p.capstoneBountyIds.forEach(ref => assert.ok(bountyIds.has(ref), ref)); }
  for (const b of bounties) { assert.equal(b.isPaidOpportunity, false); assert.ok(b.resourceLinks.length); b.resourceLinks.forEach(r => { assert.ok(r.title); link(r.url); }); b.prerequisiteMissionIds.forEach(ref => assert.ok(missionIds.has(ref), ref)); b.prerequisiteSkillIds.forEach(s => assert.ok(skills.has(s), s)); }
  assert.ok(radarItems.length >= 5);
  for (const r of radarItems) { link(r.canonicalUrl); assert.ok(date(r.publishedAt) && date(r.fetchedAt)); if (r.updatedAt) assert.ok(date(r.updatedAt)); assert.ok(['preprint','journal','conference','organization-update','documentation'].includes(r.kind)); assert.ok(['metadata-verified','editor-reviewed','draft'].includes(r.reviewStatus)); r.relatedMissionIds.forEach(ref => assert.ok(missionIds.has(ref), ref)); r.relatedBountyIds.forEach(ref => assert.ok(bountyIds.has(ref), ref)); }
});

test('first-agent branches, completion, invalid choices and tampered replay', () => {
  const m = missions.find(m => m.id === 'first-agent');
  const initial = startMission(m), snapshot = structuredClone(initial);
  assert.throws(() => chooseMissionAnswer(m, initial, 'unknown'));
  const branch = chooseMissionAnswer(m, initial, 'a').nextRun;
  const direct = chooseMissionAnswer(m, initial, 'c').nextRun;
  assert.notEqual(branch.currentStepId, direct.currentStepId); assert.deepEqual(initial, snapshot);
  for (const altered of [{ ...direct, missionId: 'other' }, { ...direct, totalScore: 999 }, { ...direct, currentStepId: branch.currentStepId }, { ...direct, answers: [...direct.answers, direct.answers[0]] }]) assert.throws(() => reviewMissionRun(m, altered));
  for (let run of [branch, direct]) {
    let count = 0;
    while (run.status !== 'completed') {
      assert.ok(++count <= m.steps.length, 'branch must terminate');
      const step = m.steps.find(s => s.id === run.currentStepId);
      const result = chooseMissionAnswer(m, run, step.choices.reduce((a,b) => a.score >= b.score ? a : b).id);
      run = result.nextRun; assert.equal(result.done, run.status === 'completed');
    }
    const review = reviewMissionRun(m, run);
    const expectedMax = run.answers.reduce((sum, answer) => sum + Math.max(...m.steps.find(step => step.id === answer.stepId).choices.map(choice => choice.score)), 0);
    assert.equal(review.maxScore, expectedMax); assert.ok(review.score <= review.maxScore && review.score >= 0); assert.equal(review.score, run.totalScore);
    assert.throws(() => chooseMissionAnswer(m, run, 'a'));
  }
});

test('progress is SSR-safe, rejects corrupted and oversized storage, and handles unavailable storage', () => {
  delete globalThis.window; assert.equal(readLocalProgress().schemaVersion, 1); assert.doesNotThrow(() => writeLocalProgress(readLocalProgress()));
  let raw = null, removed = 0; globalThis.window = { localStorage: { getItem: () => raw, setItem: (_key, value) => { raw = value; }, removeItem: () => { removed++; raw = null; } } };
  try {
    for (const bad of ['{', JSON.stringify({ schemaVersion: 99 }), 'x'.repeat(150 * 1024 + 1)]) { raw = bad; assert.deepEqual(readLocalProgress().completedMissionIds, []); assert.equal(raw, null); }
    raw = JSON.stringify({ schemaVersion: 1, completedMissionIds: [], interests: [], updatedAt: new Date().toISOString(), missionRuns: { 'first-agent': { missionId: 'other', currentStepId: null, answers: [], totalScore: 0, status: 'completed' } } });
    assert.deepEqual(readLocalProgress().missionRuns, {}); assert.equal(raw, null);
    assert.equal(removed, 4);
    const p = { ...readLocalProgress(), interests: ['research'], completedMissionIds: ['first-agent'] }; writeLocalProgress(p); assert.deepEqual(readLocalProgress().interests, ['research']);
    globalThis.window.localStorage = { getItem() { throw Error('denied'); }, setItem() { throw Error('denied'); }, removeItem() { throw Error('denied'); } };
    assert.doesNotThrow(() => readLocalProgress()); assert.doesNotThrow(() => writeLocalProgress(p)); assert.doesNotThrow(resetLocalProgress);
  } finally { delete globalThis.window; }
});

test('bounty ranking is deterministic, ordered and favors a matching interest', () => {
  const input = { interests: ['research'], completedMissionIds: [], targetSkills: ['verification'] };
  const first = rankBounties(input, bounties, missions), second = rankBounties(input, bounties, missions);
  assert.deepEqual(first, second); assert.equal(first.length, bounties.length);
  assert.ok(first.every((item, i) => Number.isFinite(item.score) && item.score >= 0 && item.score <= 1 && item.why.length && (!i || first[i-1].score >= item.score)));
  const candidate = bounties.find(b => b.domains.includes('research'));
  const matched = rankBounties(input, [candidate], missions)[0].score;
  const unmatched = rankBounties({ ...input, interests: ['unrelated'] }, [candidate], missions)[0].score;
  assert.ok(matched > unmatched);
});

test('public Upbranch source avoids dangerous execution and privileged endpoints', () => {
  const roots = ['app/learn','app/labs','app/studio','app/paths','app/discover','app/portfolio','app/radar','components/upbranch','lib/upbranch'];
  const files = [];
  function walk(path) { if (!existsSync(path)) return; for (const entry of readdirSync(path, { withFileTypes: true })) { const child = join(path, entry.name); if (entry.isDirectory()) walk(child); else if (/\.[cm]?[jt]sx?$/.test(child)) files.push(child); } }
  roots.forEach(walk); assert.ok(files.length);
  const forbidden = [/\beval\s*\(/, /\bnew\s+Function\s*\(/, /\b(?:exec|execSync|spawn|spawnSync)\s*\(/, /['"`]\/api\/mcp(?:[/?'"`]|$)/, /POLYSHIELD_VAULT_KEY/, /SUPABASE_SERVICE_ROLE_KEY/];
  for (const file of files) { const source = readFileSync(file, 'utf8'); for (const pattern of forbidden) assert.doesNotMatch(source, pattern, `${file}: ${pattern}`); }
});


