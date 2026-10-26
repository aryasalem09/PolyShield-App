import type { Bounty } from '../contracts';

export const bounties: Bounty[] = [
  {
    "id": "ai-source-checker",
    "title": "AI Claim Evidence Checker",
    "problem": "Unsupported AI claims can spread in student research.",
    "whyItMatters": "Build practical understanding through verifiable artifacts and a clearly scoped real-world problem.",
    "aiOpportunity": "Use AI for initial hypotheses or explanations, then verify claims against source data and a simple baseline.",
    "difficulty": "beginner",
    "domains": [
      "research",
      "education"
    ],
    "prerequisiteSkillIds": [
      "verification"
    ],
    "prerequisiteMissionIds": [],
    "resourceLinks": [
      {
        "title": "Source comparison exercise",
        "url": "https://pair.withgoogle.com/guidebook/",
        "type": "tutorial"
      },
      {
        "title": "Evaluating AI agents",
        "url": "https://arxiv.org/abs/2407.01502",
        "type": "paper"
      }
    ],
    "mvpDeliverables": [
      "Working prototype or structured evidence document",
      "Documented source references and assumptions"
    ],
    "evaluationCriteria": [
      "Clear baseline comparison",
      "Reproducible checks against known examples",
      "Discussion of limitations and error cases"
    ],
    "stretchGoals": [
      "Test with a consenting user and improve accessibility"
    ],
    "evidenceChecklist": [
      "GitHub repository or dated notebook",
      "Screenshots/video of actual functioning features",
      "Evaluation results and limitations",
      "Short reflection on what AI did versus student work"
    ],
    "estimatedScope": "weekend",
    "isPaidOpportunity": false
  },
  {
    "id": "study-guide-verifier",
    "title": "Study Guide Verification Tool",
    "problem": "AI summaries may omit important context or introduce errors.",
    "whyItMatters": "Build practical understanding through verifiable artifacts and a clearly scoped real-world problem.",
    "aiOpportunity": "Use AI for initial hypotheses or explanations, then verify claims against source data and a simple baseline.",
    "difficulty": "beginner",
    "domains": [
      "general",
      "education"
    ],
    "prerequisiteSkillIds": [
      "verification"
    ],
    "prerequisiteMissionIds": [],
    "resourceLinks": [
      {
        "title": "UNESCO student AI competency framework",
        "url": "https://www.unesco.org/en/articles/ai-competency-framework-students",
        "type": "organization"
      }
    ],
    "mvpDeliverables": [
      "Working prototype or structured evidence document",
      "Documented source references and assumptions"
    ],
    "evaluationCriteria": [
      "Clear baseline comparison",
      "Reproducible checks against known examples",
      "Discussion of limitations and error cases"
    ],
    "stretchGoals": [
      "Test with a consenting user and improve accessibility"
    ],
    "evidenceChecklist": [
      "GitHub repository or dated notebook",
      "Screenshots/video of actual functioning features",
      "Evaluation results and limitations",
      "Short reflection on what AI did versus student work"
    ],
    "estimatedScope": "weekend",
    "isPaidOpportunity": false
  },
  {
    "id": "open-source-first-pr",
    "title": "Your First Reviewed Open-Source Contribution",
    "problem": "New contributors need a repeatable way to verify a small documentation improvement.",
    "whyItMatters": "A reviewed example helps newcomers practice reading project guidance and making reproducible changes.",
    "aiOpportunity": "AI may suggest wording; inspect each change yourself. Never post or submit automatically.",
    "difficulty": "intermediate",
    "domains": [
      "software",
      "education"
    ],
    "prerequisiteSkillIds": [
      "coding-agents"
    ],
    "prerequisiteMissionIds": [],
    "resourceLinks": [
      {
        "title": "GitHub good-first-issue resources",
        "url": "https://github.com/topics/good-first-issue",
        "type": "open-source"
      }
    ],
    "mvpDeliverables": [
      "Choose a public repository; read its license, contribution guidelines and issue context. Draft a focused local documentation patch and record sources for claims. Run relevant checks if available."
    ],
    "evaluationCriteria": [
      "Confirm wording matches project behavior, show a focused diff and record checks. Do not claim acceptance without evidence."
    ],
    "stretchGoals": [
      "Voluntarily submit the change and respond to maintainer feedback if appropriate."
    ],
    "evidenceChecklist": [
      "Repository license, guidelines, patch or actual contribution link and check results.",
      "How AI was used, human verification, reflection and limitations."
    ],
    "estimatedScope": "multiweek",
    "isPaidOpportunity": false
  },
  {
    "id": "agent-approval-demo",
    "title": "Agent Permissions Visualizer",
    "problem": "People struggle to see which tool permissions an AI assistant actually needs.",
    "whyItMatters": "Build practical understanding through verifiable artifacts and a clearly scoped real-world problem.",
    "aiOpportunity": "Use AI for initial hypotheses or explanations, then verify claims against source data and a simple baseline.",
    "difficulty": "intermediate",
    "domains": [
      "security",
      "education"
    ],
    "prerequisiteSkillIds": [
      "least-privilege"
    ],
    "prerequisiteMissionIds": [],
    "resourceLinks": [
      {
        "title": "AgentDojo paper",
        "url": "https://arxiv.org/abs/2406.13352",
        "type": "paper"
      },
      {
        "title": "PolyShield gateway reference",
        "url": "https://github.com/aryasalem09/PolyShield-App",
        "type": "open-source"
      }
    ],
    "mvpDeliverables": [
      "Working prototype or structured evidence document",
      "Documented source references and assumptions"
    ],
    "evaluationCriteria": [
      "Clear baseline comparison",
      "Reproducible checks against known examples",
      "Discussion of limitations and error cases"
    ],
    "stretchGoals": [
      "Test with a consenting user and improve accessibility"
    ],
    "evidenceChecklist": [
      "GitHub repository or dated notebook",
      "Screenshots/video of actual functioning features",
      "Evaluation results and limitations",
      "Short reflection on what AI did versus student work"
    ],
    "estimatedScope": "multiweek",
    "isPaidOpportunity": false
  },
  {
    "id": "air-quality-explainer",
    "title": "Air Quality Data Explainer",
    "problem": "Residents and students need context to interpret air-quality measurements.",
    "whyItMatters": "A source-linked explainer can show what observations do and do not mean without giving health advice.",
    "aiOpportunity": "AI may draft explanations, but a human must verify claims against the source. A non-AI approach is also valid.",
    "difficulty": "intermediate",
    "domains": [
      "environment",
      "education"
    ],
    "prerequisiteSkillIds": [
      "research-literacy"
    ],
    "prerequisiteMissionIds": [],
    "resourceLinks": [
      {
        "title": "OpenAQ documentation",
        "url": "https://docs.openaq.org/",
        "type": "dataset"
      }
    ],
    "mvpDeliverables": [
      "Choose one OpenAQ series; record location, pollutant, dates, units and source. Show a table or chart with missing values marked. Check OpenAQ and original provider terms before reuse."
    ],
    "evaluationCriteria": [
      "Compare three values, units and timestamps with the source; never replace missing values with zero or claim individual health risks."
    ],
    "stretchGoals": [
      "Compare compatible time periods after checking units and coverage."
    ],
    "evidenceChecklist": [
      "Source links, provider terms, retrieval date, source-value checks and limitations.",
      "How AI was used, human verification, reflection and limitations."
    ],
    "estimatedScope": "multiweek",
    "isPaidOpportunity": false
  },
  {
    "id": "nasa-data-explorer",
    "title": "Space Data Explorer",
    "problem": "Open science data is valuable but intimidating to newcomers.",
    "whyItMatters": "Build practical understanding through verifiable artifacts and a clearly scoped real-world problem.",
    "aiOpportunity": "Use AI for initial hypotheses or explanations, then verify claims against source data and a simple baseline.",
    "difficulty": "intermediate",
    "domains": [
      "space",
      "education"
    ],
    "prerequisiteSkillIds": [
      "research-literacy"
    ],
    "prerequisiteMissionIds": [],
    "resourceLinks": [
      {
        "title": "NASA citizen science",
        "url": "https://science.nasa.gov/citizen-science/",
        "type": "organization"
      }
    ],
    "mvpDeliverables": [
      "Working prototype or structured evidence document",
      "Documented source references and assumptions"
    ],
    "evaluationCriteria": [
      "Clear baseline comparison",
      "Reproducible checks against known examples",
      "Discussion of limitations and error cases"
    ],
    "stretchGoals": [
      "Test with a consenting user and improve accessibility"
    ],
    "evidenceChecklist": [
      "GitHub repository or dated notebook",
      "Screenshots/video of actual functioning features",
      "Evaluation results and limitations",
      "Short reflection on what AI did versus student work"
    ],
    "estimatedScope": "semester",
    "isPaidOpportunity": false
  },
  {
    "id": "paper-research-explorer",
    "title": "Paper Research Explorer",
    "problem": "Students may mistake incomplete paper metadata for evidence about findings or peer review.",
    "whyItMatters": "A source-linked reading list helps new researchers inspect original works.",
    "aiOpportunity": "AI may draft explanations, but a human must verify claims against the source. A non-AI approach is also valid.",
    "difficulty": "beginner",
    "domains": [
      "research",
      "education"
    ],
    "prerequisiteSkillIds": [
      "research-literacy"
    ],
    "prerequisiteMissionIds": [],
    "resourceLinks": [
      {
        "title": "OpenAlex API documentation",
        "url": "https://help.openalex.org/api/",
        "type": "tutorial"
      }
    ],
    "mvpDeliverables": [
      "Search a narrow topic in OpenAlex; show title, authors, year and DOI or original link when available. Mark missing fields and compare three records in your own notes. Do not copy full papers or proprietary corpora."
    ],
    "evaluationCriteria": [
      "Compare three records with original sources; verify publication status explicitly and never invent missing metadata."
    ],
    "stretchGoals": [
      "Add a local reading checklist; document API budget and terms."
    ],
    "evidenceChecklist": [
      "Query, date, source links, three metadata checks and unresolved uncertainties.",
      "How AI was used, human verification, reflection and limitations."
    ],
    "estimatedScope": "weekend",
    "isPaidOpportunity": false
  },
  {
    "id": "accessible-event-planner",
    "title": "Accessible Event Planner",
    "problem": "Event information can be difficult to use with a keyboard, screen reader or zoomed display.",
    "whyItMatters": "A fictional planner lets learners practice inclusive design for people with varied access needs.",
    "aiOpportunity": "AI may draft explanations, but a human must verify claims against the source. A non-AI approach is also valid.",
    "difficulty": "beginner",
    "domains": [
      "accessibility",
      "education"
    ],
    "prerequisiteSkillIds": [
      "responsible-ai"
    ],
    "prerequisiteMissionIds": [],
    "resourceLinks": [
      {
        "title": "W3C accessibility fundamentals",
        "url": "https://www.w3.org/WAI/fundamentals/",
        "type": "tutorial"
      }
    ],
    "mvpDeliverables": [
      "Create a list and detail view with entirely fictional events and accommodations. Add visible focus, labels and keyboard navigation. Collect no real attendee or accessibility information."
    ],
    "evaluationCriteria": [
      "Test every control with a keyboard, check labels and zoom, and document barriers; do not claim compliance from these checks alone."
    ],
    "stretchGoals": [
      "Invite a consenting person to review the mockup without collecting sensitive information."
    ],
    "evidenceChecklist": [
      "Synthetic examples, keyboard and zoom notes, prototype screenshots and remaining barriers.",
      "How AI was used, human verification, reflection and limitations."
    ],
    "estimatedScope": "weekend",
    "isPaidOpportunity": false
  },
  {
    "id": "energy-dashboard",
    "title": "Energy Data Dashboard",
    "problem": "Energy time-series data are difficult to compare without units, dates and definitions.",
    "whyItMatters": "A small dashboard helps learners explore a defined public energy series and its context.",
    "aiOpportunity": "AI may draft explanations, but a human must verify claims against the source. A non-AI approach is also valid.",
    "difficulty": "beginner",
    "domains": [
      "energy",
      "education"
    ],
    "prerequisiteSkillIds": [
      "research-literacy"
    ],
    "prerequisiteMissionIds": [],
    "resourceLinks": [
      {
        "title": "US Energy Information Administration open data",
        "url": "https://www.eia.gov/opendata/",
        "type": "dataset"
      }
    ],
    "mvpDeliverables": [
      "Select an EIA public series, verify reuse terms and record source, retrieval date, units, geography and frequency. Show a labeled chart or table with missing values."
    ],
    "evaluationCriteria": [
      "Compare three values and units to the source; distinguish missing values and avoid mixing incompatible frequencies or making causal claims."
    ],
    "stretchGoals": [
      "Compare a second compatible series and explain differences in definitions and coverage."
    ],
    "evidenceChecklist": [
      "Dataset link, checked terms, retrieval date, source-value checks and limitations.",
      "How AI was used, human verification, reflection and limitations."
    ],
    "estimatedScope": "weekend",
    "isPaidOpportunity": false
  },
  {
    "id": "bilingual-study-workflow",
    "title": "Bilingual Study Workflow",
    "problem": "A translated study note can change meaning, omit context or introduce an incorrect term.",
    "whyItMatters": "A comparison workflow helps language learners check translations rather than trust fluent answers.",
    "aiOpportunity": "AI may suggest translations; a human must verify meaning and terminology. A manual comparison also works.",
    "difficulty": "beginner",
    "domains": [
      "education",
      "education"
    ],
    "prerequisiteSkillIds": [
      "verification"
    ],
    "prerequisiteMissionIds": [],
    "resourceLinks": [
      {
        "title": "UNESCO student AI competency framework",
        "url": "https://www.unesco.org/en/articles/ai-competency-framework-students",
        "type": "organization"
      }
    ],
    "mvpDeliverables": [
      "Create a fictional passage and two translations. Check meaning, terminology, omissions and uncertainty against a trusted reference or knowledgeable reviewer. Use no real grades, school IDs or personal information."
    ],
    "evaluationCriteria": [
      "Identify a deliberately introduced mistranslation; distinguish verified from uncertain phrases and confirm all examples are synthetic."
    ],
    "stretchGoals": [
      "Compare another synthetic passage and document difficult verification cases."
    ],
    "evidenceChecklist": [
      "Synthetic examples, references, human checklist, corrections and uncertainties.",
      "How AI was used, human verification, reflection and limitations."
    ],
    "estimatedScope": "weekend",
    "isPaidOpportunity": false
  }
];
