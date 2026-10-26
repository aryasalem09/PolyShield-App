"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink, Search } from "lucide-react";
import type { RadarItem } from "@/lib/upbranch/contracts";

const kinds: Record<RadarItem["kind"], string> = {
  preprint: "Preprint", journal: "Journal", conference: "Conference", "organization-update": "Organization report", documentation: "Educational resource",
};

function date(value: string) {
  return new Date(`${value.slice(0, 10)}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

export function RadarExplorer({ items }: { items: RadarItem[] }) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("All topics");
  const [kind, setKind] = useState("All types");
  const topics = Array.from(new Set(items.flatMap((item) => item.topicTags))).sort();
  const availableKinds = Array.from(new Set(items.map((item) => item.kind)));
  const shown = items.filter((item) =>
    (topic === "All topics" || item.topicTags.includes(topic)) &&
    (kind === "All types" || item.kind === kind) &&
    `${item.title} ${item.source} ${item.summary} ${item.topicTags.join(" ")}`.toLowerCase().includes(query.toLowerCase().trim()),
  );

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-[#f6f5ef] text-[#20251f]">
      <div className="mx-auto max-w-7xl px-5 pb-20 pt-14 sm:px-8 lg:px-12 lg:pt-20">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#506347]">Research, translated</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight sm:text-6xl">The Radar<span className="text-[#779a60]">.</span></h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#505b4d]">Ideas worth understanding, with the context to put them into practice. Explore the source, learn the limits, and find your next project.</p>
          <p className="mt-6 inline-block rounded-full border border-[#b9c8ae] bg-[#e8f1df] px-4 py-2 text-sm font-medium">Static curated edition · October 26, 2026</p>
        </div>

        <div className="mt-12 grid gap-3 border-y border-[#d8ded2] py-5 md:grid-cols-[1fr_190px_190px]">
          <label className="relative block"><span className="sr-only">Search research</span><Search aria-hidden="true" className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-[#61705c]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search topics or titles" className="w-full rounded-xl border border-[#cbd4c5] bg-white py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-[#779a60]" /></label>
          <label><span className="sr-only">Filter by topic</span><select value={topic} onChange={(event) => setTopic(event.target.value)} className="w-full rounded-xl border border-[#cbd4c5] bg-white p-3 focus:ring-2 focus:ring-[#779a60]"><option>All topics</option>{topics.map((value) => <option key={value}>{value}</option>)}</select></label>
          <label><span className="sr-only">Filter by source type</span><select value={kind} onChange={(event) => setKind(event.target.value)} className="w-full rounded-xl border border-[#cbd4c5] bg-white p-3 focus:ring-2 focus:ring-[#779a60]"><option>All types</option>{availableKinds.map((value) => <option key={value} value={value}>{kinds[value]}</option>)}</select></label>
        </div>
        <p aria-live="polite" className="mb-5 mt-6 text-sm font-medium text-[#5b6857]">{shown.length} {shown.length === 1 ? "source" : "sources"}</p>
        {shown.length === 0 ? <p className="rounded-2xl border border-[#d8ded2] bg-white p-8">No sources match those filters. Try a different topic or search.</p> : (
          <div className="grid gap-5 lg:grid-cols-2">{shown.map((item) => (
            <article key={item.id} className="flex flex-col rounded-3xl border border-[#d5ddcf] bg-white p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold"><span className="rounded-full bg-[#c8ee91] px-3 py-1.5">{kinds[item.kind]}</span><span className="rounded-full bg-[#f0f2ec] px-3 py-1.5">Metadata verified</span><span className="text-[#687665]">{date(item.publishedAt)}</span></div>
              <h2 className="mt-5 text-2xl font-semibold leading-tight tracking-tight">{item.title}</h2>
              <p className="mt-2 text-sm text-[#687665]">{item.source}</p>
              <p className="mt-5 leading-7 text-[#465144]">{item.summary}</p>
              <div className="mt-6 border-l-2 border-[#a8d37b] pl-4"><h3 className="text-xs font-bold uppercase tracking-wider">Why it matters</h3><p className="mt-2 leading-7 text-[#465144]">{item.whyItMatters}</p></div>
              <div className="mt-5 flex flex-wrap gap-2">{item.topicTags.map((tag) => <span key={tag} className="text-xs text-[#5c6d57]">#{tag.replace(/\s+/g, "")}</span>)}</div>
              <details className="mt-6 border-t border-[#e3e8df] pt-4 text-sm"><summary className="cursor-pointer font-semibold">Source details &amp; limitations</summary><div className="mt-4 space-y-3 leading-6 text-[#52604f]"><p><strong>Authors:</strong> {item.authors.join(", ")}</p><p><strong>Original date:</strong> {date(item.publishedAt)}{item.updatedAt && <> · <strong>Source update:</strong> {date(item.updatedAt)}</>}</p><p><strong>Metadata checked:</strong> {date(item.fetchedAt)}</p>{item.arxivId && <p><strong>arXiv:</strong> {item.arxivId}</p>}<p><strong>Limits:</strong> {item.limitations}</p>{item.id === "agentdojo-2024" && <p><a href="https://proceedings.neurips.cc/paper_files/paper/2024/hash/97091a5177d8dc64b1da8bf3e1f6fb54-Abstract-Datasets_and_Benchmarks_Track.html" className="underline underline-offset-4">NeurIPS proceedings record</a></p>}</div></details>
              <div className="mt-auto flex flex-wrap gap-x-5 gap-y-3 pt-6 text-sm font-semibold"><a href={item.canonicalUrl} className="inline-flex items-center gap-1 underline underline-offset-4">Original source <ExternalLink aria-hidden="true" size={15} /></a><Link href={`/learn/${item.relatedMissionIds[0]}`} className="inline-flex items-center gap-1 underline underline-offset-4">Learn this <ArrowRight aria-hidden="true" size={15} /></Link><Link href={`/discover/${item.relatedBountyIds[0]}`} className="inline-flex items-center gap-1 underline underline-offset-4">Build this <ArrowRight aria-hidden="true" size={15} /></Link></div>
            </article>
          ))}</div>
        )}
        <p className="mt-10 max-w-3xl text-sm leading-6 text-[#687665]">Metadata verified means the title, date and source were checked against the linked record. It does not certify the conclusions. Source dates and the date this edition was assembled are different.</p>
      </div>
    </main>
  );
}
