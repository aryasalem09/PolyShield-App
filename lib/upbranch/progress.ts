import type { LocalProgress, MissionRun } from './contracts';

const KEY = 'upbranch:progress:v1';
const MAX_BYTES = 150 * 1024;
const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const empty = (): LocalProgress => ({ schemaVersion: 1, completedMissionIds: [], missionRuns: {}, interests: [], updatedAt: new Date(0).toISOString() });
const isId = (value: unknown): value is string => typeof value === 'string' && value.length <= 80 && idPattern.test(value);
const isDate = (value: unknown): value is string => typeof value === 'string' && value.length <= 30 && !Number.isNaN(Date.parse(value));
const ids = (value: unknown): string[] => Array.isArray(value) ? [...new Set(value.filter(isId))].slice(0, 500) : [];
function normalize(value: unknown): LocalProgress | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const p = value as Record<string, unknown>;
  if (p.schemaVersion !== 1 || !Array.isArray(p.completedMissionIds) || !Array.isArray(p.interests) || !p.missionRuns || typeof p.missionRuns !== 'object' || Array.isArray(p.missionRuns) || !isDate(p.updatedAt)) return null;
  const missionRuns: Record<string, MissionRun> = {};
  for (const [id, raw] of Object.entries(p.missionRuns).slice(0, 500)) {
    if (!isId(id) || !raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
    const run = raw as Record<string, unknown>;
    if (run.missionId !== id || !(run.currentStepId === null || isId(run.currentStepId)) || !Array.isArray(run.answers) || run.answers.length > 500 || typeof run.totalScore !== 'number' || !Number.isSafeInteger(run.totalScore) || run.totalScore < 0 || run.totalScore > 1500 || (run.status !== 'in_progress' && run.status !== 'completed')) return null;
    const answers: MissionRun['answers'] = [];
    for (const rawAnswer of run.answers) {
      if (!rawAnswer || typeof rawAnswer !== 'object' || Array.isArray(rawAnswer)) return null;
      const answer = rawAnswer as Record<string, unknown>;
      if (!isId(answer.stepId) || !isId(answer.choiceId) || !isDate(answer.at)) return null;
      answers.push({ stepId: answer.stepId, choiceId: answer.choiceId, at: answer.at });
    }
    missionRuns[id] = { missionId: id, currentStepId: run.currentStepId as string | null, answers, totalScore: run.totalScore, status: run.status };
  }
  return { schemaVersion: 1, completedMissionIds: ids(p.completedMissionIds), missionRuns, interests: ids(p.interests), updatedAt: p.updatedAt };
}
export function readLocalProgress(): LocalProgress {
  if (typeof window === 'undefined') return empty();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw === null) return empty();
    if (new TextEncoder().encode(raw).length > MAX_BYTES) throw new Error('oversized');
    const progress = normalize(JSON.parse(raw));
    if (!progress) throw new Error('invalid');
    return progress;
  } catch { resetLocalProgress(); return empty(); }
}
export function writeLocalProgress(p: LocalProgress): void {
  if (typeof window === 'undefined') return;
  try {
    const safe = normalize(p);
    if (!safe) return;
    const raw = JSON.stringify(safe);
    if (new TextEncoder().encode(raw).length <= MAX_BYTES) window.localStorage.setItem(KEY, raw);
  } catch { /* storage may be unavailable */ }
}
export function resetLocalProgress(): void {
  if (typeof window === 'undefined') return;
  try { window.localStorage.removeItem(KEY); } catch { /* storage may be unavailable */ }
}
