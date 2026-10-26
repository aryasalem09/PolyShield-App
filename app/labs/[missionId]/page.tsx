import { notFound } from "next/navigation";
import { SiteShell } from "@/components/upbranch/ui/site-shell";
import { MissionPlayer } from "@/components/upbranch/labs/mission-player";
import { getMission } from "@/lib/upbranch/catalog";

export default async function LabPage({ params }: { params: Promise<{ missionId: string }> }) {
  const { missionId } = await params;
  const mission = getMission(missionId);
  if (!mission || !mission.published) notFound();
  return <SiteShell><main id="main-content" tabIndex={-1} className="mx-auto max-w-6xl px-6 py-12 text-[#20251f]"><p className="text-sm font-semibold uppercase tracking-widest">Simulation · {mission.estimatedMinutes} minutes</p><h1 className="mt-3 text-4xl font-semibold">{mission.title}</h1><p className="mb-8 mt-3 max-w-2xl leading-7">{mission.summary}</p><MissionPlayer key={mission.id} mission={mission} /></main></SiteShell>;
}
