export type SkillId =
  | 'ai-basics' | 'prompting' | 'context' | 'delegation'
  | 'verification' | 'agent-tools' | 'least-privilege'
  | 'privacy' | 'research-literacy' | 'evaluation'
  | 'coding-agents' | 'responsible-ai';

export type SkillDomain = 'understand' | 'work-with-ai' | 'build-with-agents' | 'responsible-ai';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type ScenarioDecision = 'allow' | 'flag' | 'require_approval' | 'deny';

export type MissionChoice = {
  id: string;
  label: string;
  response: string;          // authored explanation for this choice
  score: number;             // integer 0..3, not a probability
  skillEvidence: Partial<Record<SkillId, number>>;
  nextStepId?: string;       // omission means follow current order or finish
};

export type MissionStep = {
  id: string;
  kind: 'choice' | 'context-pick' | 'trace-review' | 'permission-choice';
  title: string;
  scenario: string;          // safe Markdown-ish authored copy, no HTML injection
  choices: MissionChoice[];
  technicalNote?: string;
  fixtureId?: string;       // points to in-memory synthetic security fixture
};

export type Mission = {
  id: string;
  title: string;
  summary: string;
  domain: SkillDomain;
  difficulty: Difficulty;
  estimatedMinutes: number;
  objective: string;
  skillIds: SkillId[];
  prerequisiteMissionIds: string[];
  sourceUrls: string[];
  steps: MissionStep[];
  published: boolean;
};

export type MissionAnswer = { stepId: string; choiceId: string; at: string };
export type MissionRun = {
  missionId: string;
  currentStepId: string | null;
  answers: MissionAnswer[];
  totalScore: number;
  status: 'in_progress' | 'completed';
};
export type MissionOutcome = {
  nextRun: MissionRun;
  lastChoice: MissionChoice;
  feedback: string;
  done: boolean;
};

export type Pathway = {
  id: string;
  title: string;
  subtitle: string;
  interestTags: string[];
  missionIds: string[];
  capstoneBountyIds: string[];
};

export type Bounty = {
  id: string;
  title: string;
  problem: string;
  whyItMatters: string;
  aiOpportunity: string;     // can explicitly say AI not necessary
  difficulty: Difficulty;
  domains: string[];
  prerequisiteSkillIds: SkillId[];
  prerequisiteMissionIds: string[];
  resourceLinks: { title: string; url: string; type: 'dataset'|'paper'|'tutorial'|'open-source'|'organization' }[];
  mvpDeliverables: string[];
  evaluationCriteria: string[];
  stretchGoals: string[];
  evidenceChecklist: string[];
  estimatedScope: 'weekend' | 'multiweek' | 'semester';
  isPaidOpportunity: false;  // R0 is not a freelance marketplace
};

export type RadarSourceKind = 'preprint' | 'journal' | 'conference' | 'organization-update' | 'documentation';
export type RadarReviewStatus = 'metadata-verified' | 'editor-reviewed' | 'draft';
export type RadarItem = {
  id: string;
  title: string;
  canonicalUrl: string;
  doi?: string;
  arxivId?: string;
  authors: string[];
  publishedAt: string;       // ISO, original document date, do not substitute ingestion date
  updatedAt?: string;
  fetchedAt: string;
  source: string;
  kind: RadarSourceKind;
  reviewStatus: RadarReviewStatus;
  topicTags: string[];
  summary: string;           // Upbranch-authored, no unsupported conclusions
  whyItMatters: string;
  limitations: string;
  relatedMissionIds: string[];
  relatedBountyIds: string[];
};

export type LocalProgress = {
  schemaVersion: 1;
  completedMissionIds: string[];
  missionRuns: Record<string, MissionRun>;
  interests: string[];
  updatedAt: string;
};
