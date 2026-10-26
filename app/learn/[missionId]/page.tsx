import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MissionPlayer } from '@/components/upbranch/labs/mission-player';
import { SiteShell } from '@/components/upbranch/ui/site-shell';
import { missions } from '@/lib/upbranch/content/missions';

export default async function MissionPage({ params }: { params: Promise<{ missionId: string }> }) {
  const { missionId } = await params;
  const mission = missions.find((item) => item.id === missionId);
  if (!mission) notFound();
  return <SiteShell><main id="main-content" tabIndex={-1} className="min-h-screen bg-[#f6f5ef] px-6 py-12 text-[#20251f] md:px-10 md:py-16"><div className="mx-auto max-w-5xl">
    <Link href="/learn" className="text-sm font-semibold underline underline-offset-4">← All missions</Link>
    <div className="mt-10 border-b border-[#20251f]/20 pb-8"><p className="text-xs font-bold uppercase tracking-[.2em]">Simulation · {mission.estimatedMinutes} min</p><h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">{mission.title}</h1><p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#465044]">{mission.objective}</p></div>
    {mission.published ? <div className="mt-8"><MissionPlayer key={mission.id} mission={mission} /></div> : <p className="mt-8">This mission is coming soon. Explore another mission while it is being prepared.</p>}
    <section className="mt-16 border-t border-[#20251f]/20 pt-6"><h2 className="font-semibold">Explore the sources</h2><ul className="mt-3 space-y-2 text-sm">{mission.sourceUrls.map((url) => <li key={url}><a className="break-all underline underline-offset-4" href={url} target="_blank" rel="noopener noreferrer">{new URL(url).hostname}</a></li>)}</ul></section>
  </div></main></SiteShell>;
}
