import type { Bounty, Mission, SkillId } from '../contracts';

/** Hand-tuned product heuristic, not a prediction of learner success. */
export function rankBounties(input: { interests: string[]; completedMissionIds: string[]; targetSkills: SkillId[] }, bounties: Bounty[], missions: Mission[]): { bounty: Bounty; score: number; why: string[] }[] {
  const interests = input.interests.map(x => x.toLowerCase().trim()).filter(Boolean);
  const completed = new Set(input.completedMissionIds);
  const practiced = new Set(missions.filter(m => completed.has(m.id)).flatMap(m => m.skillIds));
  return bounties.map(bounty => {
    const matched = bounty.domains.filter(d => interests.some(i => d.toLowerCase().includes(i) || i.includes(d.toLowerCase())));
    const interest = interests.length ? Math.min(1, matched.length / interests.length) : 0;
    const required = bounty.prerequisiteMissionIds;
    const readiness = required.length ? required.filter(id => completed.has(id)).length / required.length : 1;
    const skills = input.targetSkills.length ? bounty.prerequisiteSkillIds.filter(s => input.targetSkills.includes(s)).length / input.targetSkills.length : 0;
    const feasibility = bounty.difficulty === 'beginner' ? 1 : bounty.difficulty === 'intermediate' ? .6 : .3;
    const why = [matched.length ? `Matches your interest in ${matched.join(', ')}` : 'An option to explore a new topic', required.length && readiness < 1 ? 'Some prerequisite missions are still ahead' : 'No unfinished required missions', ...bounty.prerequisiteSkillIds.filter(s => practiced.has(s)).map(s => `Uses your practiced ${s.replaceAll('-', ' ')} skill`)];
    return { bounty, score: .35 * interest + .30 * readiness + .20 * skills + .15 * feasibility, why };
  }).sort((a,b) => b.score - a.score || a.bounty.id.localeCompare(b.bounty.id));
}
