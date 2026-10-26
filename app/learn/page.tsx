import Link from 'next/link';
import { ArrowRight, Clock, Sparkles } from 'lucide-react';
import { SiteShell } from '@/components/upbranch/ui/site-shell';
import { missions } from '@/lib/upbranch/content/missions';

const pillars = [
  ['01', 'Understand AI', 'Learn what AI can do, where it falls short, and how to check a claim.'],
  ['02', 'Work with AI', 'Give useful context, set a clear goal, and judge the result.'],
  ['03', 'Build with agents', 'Practice supervising an assistant as it works through a task.'],
  ['04', 'Responsible AI', 'Make thoughtful choices about privacy and permissions.'],
];

export default function LearnPage() {
  return <SiteShell><main id="main-content" tabIndex={-1} className="bg-[#f6f5ef] text-[#20251f]">
    <section className="mx-auto max-w-7xl px-6 pb-16 pt-16 md:px-10 md:pb-24 md:pt-24">
      <div className="grid gap-8 border-b border-[#20251f]/20 pb-12 md:grid-cols-[1.4fr_1fr] md:items-end">
        <div><p className="mb-5 text-xs font-bold uppercase tracking-[.22em]">The learning library / 01</p><h1 className="max-w-3xl text-5xl font-semibold leading-[.98] tracking-[-.05em] md:text-7xl">Get curious.<br /><span className="text-[#547b38]">Get capable.</span></h1></div>
        <p className="max-w-md text-lg leading-relaxed text-[#465044]">Build practical AI skills through small decisions, useful feedback, and projects that connect learning to real life.</p>
      </div>
      <div className="mt-12 flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.2em]">Start here</p><h2 className="mt-2 text-3xl font-semibold tracking-tight">Choose a mission</h2></div><Sparkles aria-hidden="true" className="hidden h-8 w-8 sm:block" /></div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">{missions.map((mission, index) => <article key={mission.id} className={`flex min-h-72 flex-col rounded-2xl border border-[#20251f]/15 p-6 ${index === 0 ? 'bg-[#c8ee91]' : 'bg-white/60'}`}><div className="flex items-center justify-between text-xs font-bold uppercase tracking-[.16em]"><span>{mission.published ? 'Ready to play' : 'Coming soon'}</span><span>0{index + 1}</span></div><h3 className="mt-9 text-2xl font-semibold tracking-tight">{mission.title}</h3><p className="mt-3 flex-1 leading-relaxed text-[#465044]">{mission.summary}</p><div className="mt-7 flex items-center justify-between text-sm"><span className="flex items-center gap-2"><Clock className="h-4 w-4" aria-hidden="true" /> {mission.estimatedMinutes} min</span>{mission.published && <Link className="flex items-center gap-2 font-semibold underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2" href={`/learn/${mission.id}`}>Start mission <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>}</div></article>)}</div>
    </section>
    <section className="bg-[#20251f] text-[#f6f5ef]"><div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#c8ee91]">A foundation for what comes next</p><h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Four ways to grow</h2><div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">{pillars.map(([number, title, description]) => <div key={number} className="border-t border-white/30 pt-5"><span className="text-sm text-[#c8ee91]">{number}</span><h3 className="mt-6 text-xl font-semibold">{title}</h3><p className="mt-3 leading-relaxed text-white/70">{description}</p></div>)}</div></div></section>
  </main></SiteShell>;
}
