import type { Pathway } from '../contracts';

export const pathways: Pathway[] = [
  {
    "id": "ai-foundations",
    "title": "AI Foundations",
    "subtitle": "Understand model limits and verify results.",
    "interestTags": [
      "general",
      "school",
      "research"
    ],
    "missionIds": [
      "spot-the-hallucination",
      "first-agent"
    ],
    "capstoneBountyIds": [
      "ai-source-checker",
      "study-guide-verifier"
    ]
  },
  {
    "id": "agent-builder",
    "title": "AI Agent Builder",
    "subtitle": "Delegate responsibly and evaluate agent work.",
    "interestTags": [
      "programming",
      "software",
      "coding"
    ],
    "missionIds": [
      "first-agent",
      "permission-architect"
    ],
    "capstoneBountyIds": [
      "open-source-first-pr",
      "agent-approval-demo"
    ]
  },
  {
    "id": "responsible-ai",
    "title": "Responsible AI",
    "subtitle": "Learn privacy, authorization and trustworthy AI workflows.",
    "interestTags": [
      "cybersecurity",
      "privacy",
      "social-impact"
    ],
    "missionIds": [
      "permission-architect",
      "spot-the-hallucination"
    ],
    "capstoneBountyIds": [
      "agent-approval-demo",
      "ai-source-checker"
    ]
  }
];
