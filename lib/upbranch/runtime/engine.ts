import type { Mission, MissionChoice, MissionOutcome, MissionRun, SkillId } from "@/lib/upbranch/contracts";

function nextId(mission: Mission, index: number, choice: MissionChoice): string | null {
  return choice.nextStepId ?? mission.steps[index + 1]?.id ?? null;
}

function validateMission(mission: Mission): void {
  if (!mission.steps.length) throw new Error("Mission has no steps");
  const ids = new Set(mission.steps.map((step) => step.id));
  if (ids.size !== mission.steps.length) throw new Error("Duplicate step ID");
  for (const [index, step] of mission.steps.entries()) {
    if (!step.choices.length || new Set(step.choices.map((choice) => choice.id)).size !== step.choices.length) throw new Error("Invalid choices");
    for (const choice of step.choices) {
      if (!Number.isInteger(choice.score) || choice.score < 0 || choice.score > 3) throw new Error("Invalid choice score");
      const next = nextId(mission, index, choice);
      if (next !== null && !ids.has(next)) throw new Error("Unknown next step");
    }
  }
  const visited = new Set<string>();
  const active = new Set<string>();
  function visit(id: string) {
    if (active.has(id)) throw new Error("Mission contains a cycle");
    if (visited.has(id)) return;
    active.add(id);
    const index = mission.steps.findIndex((step) => step.id === id);
    for (const choice of mission.steps[index].choices) {
      const next = nextId(mission, index, choice);
      if (next !== null) visit(next);
    }
    active.delete(id);
    visited.add(id);
  }
  for (const step of mission.steps) visit(step.id);
}

function replay(mission: Mission, run: MissionRun) {
  validateMission(mission);
  if (run.missionId !== mission.id || !Array.isArray(run.answers)) throw new Error("Invalid mission run");
  let current: string | null = mission.steps[0].id;
  let score = 0;
  let maxScore = 0;
  const skills = new Set<SkillId>();
  for (const answer of run.answers) {
    if (current === null || answer.stepId !== current || typeof answer.at !== "string" || !Number.isFinite(Date.parse(answer.at))) throw new Error("Invalid answer path");
    const index = mission.steps.findIndex((step) => step.id === current);
    const step = mission.steps[index];
    const choice = step.choices.find((item) => item.id === answer.choiceId);
    if (!choice) throw new Error("Unknown choice");
    score += choice.score;
    maxScore += Math.max(...step.choices.map((item) => item.score));
    for (const [skill, value] of Object.entries(choice.skillEvidence)) if (typeof value === "number" && value > 0) skills.add(skill as SkillId);
    current = nextId(mission, index, choice);
  }
  if (run.currentStepId !== current || run.totalScore !== score || run.status !== (current === null ? "completed" : "in_progress")) throw new Error("Run state does not match answers");
  return { current, score, maxScore, skills: [...skills] };
}

export function startMission(mission: Mission): MissionRun {
  validateMission(mission);
  return { missionId: mission.id, currentStepId: mission.steps[0].id, answers: [], totalScore: 0, status: "in_progress" };
}

export function chooseMissionAnswer(mission: Mission, run: MissionRun, choiceId: string): MissionOutcome {
  const state = replay(mission, run);
  if (state.current === null) throw new Error("Mission is already completed");
  const index = mission.steps.findIndex((step) => step.id === state.current);
  const choice = mission.steps[index].choices.find((item) => item.id === choiceId);
  if (!choice) throw new Error("Unknown choice");
  const currentStepId = nextId(mission, index, choice);
  const nextRun: MissionRun = { ...run, currentStepId, answers: [...run.answers, { stepId: state.current, choiceId, at: new Date().toISOString() }], totalScore: run.totalScore + choice.score, status: currentStepId === null ? "completed" : "in_progress" };
  return { nextRun, lastChoice: choice, feedback: choice.response, done: currentStepId === null };
}

export function reviewMissionRun(mission: Mission, run: MissionRun): { score: number; maxScore: number; demonstratedSkills: SkillId[]; suggestedNextMissionIds: string[] } {
  const state = replay(mission, run);
  return { score: state.score, maxScore: state.maxScore, demonstratedSkills: state.skills, suggestedNextMissionIds: [] };
}
