"use client";

import { useEffect, useState } from "react";
import type { Mission, MissionRun } from "@/lib/upbranch/contracts";
import { readLocalProgress, writeLocalProgress } from "@/lib/upbranch/progress";
import { chooseMissionAnswer, reviewMissionRun, startMission } from "@/lib/upbranch/runtime/engine";
import { securityDemo } from "@/lib/upbranch/runtime/security-demo";

export function MissionPlayer({ mission, onComplete }: { mission: Mission; onComplete?: (result: { missionId: string; score: number; completedAt: string }) => void }) {
  const [run, setRun] = useState<MissionRun>(() => startMission(mission));
  const [ready, setReady] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  useEffect(() => {
    const saved = readLocalProgress().missionRuns[mission.id];
    if (saved) {
      try { reviewMissionRun(mission, saved); setRun(saved); } catch { setRun(startMission(mission)); }
    }
    setReady(true);
  }, [mission]);
  function save(next: MissionRun) {
    setRun(next);
    const progress = readLocalProgress();
    const completedMissionIds = progress.completedMissionIds.filter((id) => id !== mission.id);
    if (next.status === "completed") completedMissionIds.push(mission.id);
    writeLocalProgress({ ...progress, missionRuns: { ...progress.missionRuns, [mission.id]: next }, completedMissionIds, updatedAt: new Date().toISOString() });
  }
  function answer(choiceId: string) {
    const outcome = chooseMissionAnswer(mission, run, choiceId);
    save(outcome.nextRun);
    setFeedback(outcome.feedback);
    if (outcome.done) onComplete?.({ missionId: mission.id, score: outcome.nextRun.totalScore, completedAt: new Date().toISOString() });
  }
  function back() {
    const last = run.answers.at(-1);
    if (!last) return;
    const answers = run.answers.slice(0, -1);
    const totalScore = answers.reduce((sum, item) => sum + (mission.steps.find((step) => step.id === item.stepId)?.choices.find((choice) => choice.id === item.choiceId)?.score ?? 0), 0);
    save({ missionId: mission.id, currentStepId: last.stepId, answers, totalScore, status: "in_progress" });
    setFeedback(null);
  }
  function reset() { save(startMission(mission)); setFeedback(null); }
  const step = mission.steps.find((item) => item.id === run.currentStepId);
  const review = reviewMissionRun(mission, run);
  const demo = securityDemo();
  const isFirst = mission.id === "first-agent";
  const answerFor = (id: string) => run.answers.find((answer) => answer.stepId === id)?.choiceId;
  return <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]" aria-busy={!ready}>
    <section className="rounded-3xl border border-[#20251f]/15 bg-white p-6 sm:p-8">
      <p className="text-xs font-bold uppercase tracking-widest text-[#55713d]">Simulation · Decision {Math.min(run.answers.length + 1, mission.steps.length)}</p>
      <h2 className="mt-3 text-2xl font-semibold">{feedback ? "Reflection" : step?.title ?? "Mission debrief"}</h2>
      {!ready ? <p className="mt-4">Loading saved progress…</p> : feedback ? <div aria-live="polite"><p className="mt-4 leading-7">{feedback}</p><button onClick={() => setFeedback(null)} className="mt-6 rounded-full bg-[#20251f] px-5 py-3 font-semibold text-white">{run.status === "completed" ? "See debrief" : "Continue"}</button></div> : step ? <><p className="mt-4 leading-7">{step.scenario}</p><div className="mt-6 grid gap-3" aria-label="Choose a response">{step.choices.map((choice) => <button key={choice.id} onClick={() => answer(choice.id)} className="rounded-2xl border border-[#20251f]/20 p-4 text-left leading-6 hover:border-[#55713d] hover:bg-[#f6f5ef] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#55713d]">{choice.label}</button>)}</div>{step.technicalNote && <p className="mt-5 text-sm text-[#596257]">{step.technicalNote}</p>}</> : <div aria-live="polite"><p className="mt-4 text-xl font-semibold">{review.score} / {review.maxScore} points on your path</p><p className="mt-3 leading-7">Skills demonstrated: {review.demonstratedSkills.length ? review.demonstratedSkills.join(", ").replaceAll("-", " ") : "Keep practicing and try another approach."}</p><p className="mt-3 text-sm text-[#596257]">Scores reflect the choices in this simulation, not a certification or a measure of real-world competence.</p><button onClick={reset} className="mt-6 rounded-full bg-[#20251f] px-5 py-3 font-semibold text-white">Retry mission</button></div>}
      <div className="mt-8 flex gap-4 border-t border-[#20251f]/10 pt-5 text-sm font-semibold"><button onClick={back} disabled={!run.answers.length} className="underline disabled:opacity-40">Back one decision</button><button onClick={reset} className="underline">Reset</button></div>
    </section>
    <aside className="rounded-3xl bg-[#20251f] p-6 text-[#f6f5ef] sm:p-8" aria-label="Simulated workspace">
      <div className="flex items-center justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-widest text-[#c8ee91]">Simulation · no live AI</p><h3 className="mt-2 text-xl font-semibold">Workspace activity</h3></div><span className="rounded-full border border-white/25 px-3 py-1 text-xs">Scripted</span></div>
      <div className="mt-6 rounded-2xl border border-white/15 p-4"><p className="text-xs uppercase tracking-widest text-[#c8ee91]">Fictional project</p><p className="mt-2 font-mono text-sm">{isFirst ? "portfolio / brief.txt / index.html" : "fictional reference / read-only"}</p><p className="mt-2 text-sm text-white/70">{isFirst && answerFor("context") ? (answerFor("context") === "b" ? "Minimal sample brief selected." : "The selected context includes unnecessary material.") : "Sample files only. Nothing is read from your device."}</p></div>
      <ol className="mt-6 space-y-4 text-sm"> <li><span className="font-semibold text-[#c8ee91]">01 · Intent</span><p className="mt-1">{mission.objective}</p></li>
        {run.answers.map((item, index) => { const answeredStep = mission.steps.find((s) => s.id === item.stepId)!; const choice = answeredStep.choices.find((c) => c.id === item.choiceId)!; return <li key={item.stepId} className="border-l border-[#c8ee91]/50 pl-4"><span className="font-semibold text-[#c8ee91]">{String(index + 2).padStart(2, "0")} · {answeredStep.title}</span><p className="mt-1">Decision: {choice.label}</p><p className="mt-1 text-white/70">{choice.response}</p>{isFirst && item.stepId === "verify" && <p className="mt-2 text-white/70">Simulated check: {item.choiceId === "b" ? "Missing project card identified for a targeted fix." : "The missing project card remains unverified."}</p>}{answeredStep.fixtureId === "deny-protected-file" && <p className="mt-2 text-white/70">Synthetic tool request: protected/project-config.txt → policy {demo.decision}. The explicit deny applies regardless of the selected response.</p>}</li>; })}
        {!run.answers.length && <li className="text-white/70">Your decisions will build a scripted trace here.</li>}</ol>
      <div className="mt-6 border-t border-white/15 pt-4 text-xs leading-5 text-white/70">The policy demo uses explicit protective rules; the real gateway defaults to allow when no policy matches. A separate synthetic scan matched: {demo.matched.join(", ") || "none"}. These heuristics can miss attacks or flag harmless text.</div>
    </aside>
  </div>;
}
