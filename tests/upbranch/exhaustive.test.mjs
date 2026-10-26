import test from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import { resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { missions } from '../../lib/upbranch/content/missions.ts';
import { startMission, chooseMissionAnswer, reviewMissionRun } from '../../lib/upbranch/runtime/engine.ts';

test('every published mission choice path terminates and replays with the correct score', (t) => {
  let completedPaths = 0;
  for (const mission of missions.filter(m => m.published)) {
    const original = structuredClone(mission);
    function walk(run, expectedScore, expectedMax, seen) {
      const review = reviewMissionRun(mission, run);
      assert.equal(review.score, expectedScore);
      assert.equal(review.maxScore, expectedMax);
      assert.equal(run.totalScore, expectedScore);
      if (run.status === 'completed') {
        assert.equal(run.currentStepId, null);
        assert.throws(() => chooseMissionAnswer(mission, run, 'anything'));
        completedPaths++;
        return;
      }
      assert.ok(!seen.has(run.currentStepId), `${mission.id} revisited ${run.currentStepId}`);
      const step = mission.steps.find(s => s.id === run.currentStepId);
      assert.ok(step, `${mission.id} references unknown step`);
      const nextSeen = new Set([...seen, step.id]);
      const stepMax = Math.max(...step.choices.map(c => c.score));
      for (const choice of step.choices) {
        const before = structuredClone(run);
        const outcome = chooseMissionAnswer(mission, run, choice.id);
        assert.deepEqual(run, before, 'transition must not mutate input run');
        assert.equal(outcome.done, outcome.nextRun.status === 'completed');
        assert.equal(outcome.nextRun.answers.at(-1).stepId, step.id);
        assert.equal(outcome.nextRun.answers.at(-1).choiceId, choice.id);
        walk(outcome.nextRun, expectedScore + choice.score, expectedMax + stepMax, nextSeen);
      }
    }
    walk(startMission(mission), 0, 0, new Set());
    assert.deepEqual(mission, original, 'execution must not mutate mission');
    const cyclic = structuredClone(mission);
    cyclic.steps[0].choices[0].nextStepId = cyclic.steps[0].id;
    assert.throws(() => startMission(cyclic), /cycle/i);
  }
  assert.ok(completedPaths > 0, 'at least one published path must be tested');
  t.diagnostic(`Completed paths checked: ${completedPaths}`);
});

test('fixed security demo uses protective policy and reports heuristic injection finding', async () => {
  const root = resolve(process.cwd());
  const hooks = registerHooks({ resolve(specifier, context, nextResolve) {
    if (!specifier.startsWith('@/')) return nextResolve(specifier, context);
    const path = resolve(root, specifier.slice(2) + '.ts');
    assert.ok(path.startsWith(root + sep), 'alias must stay within repository');
    return nextResolve(pathToFileURL(path).href, context);
  } });
  try {
    const { securityDemo } = await import('../../lib/upbranch/runtime/security-demo.ts');
    const result = securityDemo();
    assert.equal(result.decision, 'deny');
    assert.ok(result.matched.includes('instruction-override'));
  } finally { hooks.deregister(); }
});

