import type { RadarItem } from "@/lib/upbranch/contracts";

// Dates describe the source record, not the time this static edition was assembled.
export const radarItems: RadarItem[] = [
  {
    id: "agentdojo-2024", title: "AgentDojo: A Dynamic Environment to Evaluate Prompt Injection Attacks and Defenses for LLM Agents",
    canonicalUrl: "https://arxiv.org/abs/2406.13352", arxivId: "2406.13352",
    authors: ["Edoardo Debenedetti", "Jie Zhang", "Mislav Balunović", "Luca Beurer-Kellner", "Marc Fischer", "Florian Tramèr"],
    publishedAt: "2024-06-19", updatedAt: "2024-11-24", fetchedAt: "2026-10-26", source: "arXiv; NeurIPS 2024 Datasets and Benchmarks Track", kind: "conference", reviewStatus: "metadata-verified", topicTags: ["Safety", "Agents"],
    summary: "AgentDojo introduces tasks and security tests for evaluating agents that use tools and encounter untrusted data.",
    whyItMatters: "A useful agent needs clear trust boundaries and repeatable tests, not just a convincing answer.",
    limitations: "Results depend on the chosen tasks, models and defenses; the benchmark cannot represent every deployment. The dates shown are for the arXiv submission and revision, not the conference publication date.",
    relatedMissionIds: ["first-agent"], relatedBountyIds: ["agent-approval-demo"],
  },
  {
    id: "agents-matter-2024", title: "AI Agents That Matter", canonicalUrl: "https://arxiv.org/abs/2407.01502", arxivId: "2407.01502",
    authors: ["Sayash Kapoor", "Benedikt Stroebl", "Zachary S. Siegel", "Nitya Nadgir", "Arvind Narayanan"], publishedAt: "2024-07-01", fetchedAt: "2026-10-26", source: "arXiv", kind: "preprint", reviewStatus: "metadata-verified", topicTags: ["Reliability", "Agents"],
    summary: "This paper examines shortcomings in agent benchmarks and argues for considering cost alongside accuracy.",
    whyItMatters: "When evaluating an agent, ask whether it actually saves effort and whether its results can be reproduced.",
    limitations: "This record is a preprint; its critique is based on the benchmarks and configurations examined.", relatedMissionIds: ["first-agent"], relatedBountyIds: ["ai-source-checker"],
  },
  {
    id: "anthropic-adoption-2025", title: "Anthropic Economic Index report: Uneven geographic and enterprise AI adoption", canonicalUrl: "https://www.anthropic.com/research/anthropic-economic-index-september-2025-report",
    authors: ["Anthropic Economics Team"], publishedAt: "2025-09-15", fetchedAt: "2026-10-26", source: "Anthropic", kind: "organization-update", reviewStatus: "metadata-verified", topicTags: ["AI literacy", "Work"],
    summary: "Anthropic reports patterns in Claude usage across places and enterprise deployments.", whyItMatters: "Usage patterns can help learners ask where AI is being applied and whose experiences may be missing.",
    limitations: "This company report observes Claude usage; it is not a representative survey of all AI use and cannot establish causal effects on workers.", relatedMissionIds: ["first-agent"], relatedBountyIds: ["study-guide-verifier"],
  },
  {
    id: "unesco-students-2024", title: "AI competency framework for students", canonicalUrl: "https://www.unesco.org/en/articles/ai-competency-framework-students",
    authors: ["Fengchun Miao", "Kelly Shiohira", "Natalie Lao"], publishedAt: "2024-08-08", updatedAt: "2026-01-16", fetchedAt: "2026-10-26", source: "UNESCO", kind: "documentation", reviewStatus: "metadata-verified", topicTags: ["Education", "AI literacy"],
    summary: "UNESCO presents a framework to help educators incorporate AI competencies into school curricula.", whyItMatters: "AI literacy includes human judgment and responsible use alongside technical skills.",
    limitations: "The framework is educational guidance, not evidence that a particular lesson improves learning outcomes.", relatedMissionIds: ["first-agent"], relatedBountyIds: ["study-guide-verifier"],
  },
  {
    id: "genai-literacy-2024", title: "Generative AI Literacy: Twelve Defining Competencies", canonicalUrl: "https://arxiv.org/abs/2412.12107", arxivId: "2412.12107",
    authors: ["Ravinithesh Annapureddy", "Alessandro Fornaroli", "Daniel Gatica-Perez"], publishedAt: "2024-11-29", fetchedAt: "2026-10-26", source: "arXiv; Digital Government: Research and Practice (March 2025)", kind: "preprint", reviewStatus: "metadata-verified", topicTags: ["Education", "AI literacy"],
    summary: "The authors propose twelve competencies for understanding and working with generative AI.", whyItMatters: "The framework offers a way to think beyond prompting, including ethics and critical understanding.",
    limitations: "A proposed competency model is not itself proof that a specific teaching method works. The displayed date is the arXiv submission date.", relatedMissionIds: ["first-agent"], relatedBountyIds: ["ai-source-checker"],
  },
];
