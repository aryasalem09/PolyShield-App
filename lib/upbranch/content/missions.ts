import type { Mission } from "../contracts";

export const missions: Mission[] = [
  {
    "id": "first-agent",
    "title": "Your First AI Agent",
    "summary": "Delegate a task, give relevant context, verify results and manage permissions.",
    "domain": "build-with-agents",
    "difficulty": "beginner",
    "estimatedMinutes": 6,
    "objective": "In a simulated website task, specify the objective, withhold irrelevant private data, verify output, and deny an unauthorized file read.",
    "skillIds": [
      "prompting",
      "context",
      "verification",
      "least-privilege"
    ],
    "prerequisiteMissionIds": [],
    "sourceUrls": [
      "https://pair.withgoogle.com/guidebook/"
    ],
    "published": true,
    "steps": [
      {
        "id": "brief",
        "kind": "choice",
        "title": "Brief your assistant",
        "scenario": "A fictional AI assistant will build a school club portfolio page. Which brief sets a useful goal and boundaries?",
        "choices": [
          {
            "id": "a",
            "label": "Make me a cool website.",
            "response": "Too vague: neither success criteria nor allowed data are clear.",
            "score": 0,
            "skillEvidence": {
              "prompting": 0
            },
            "nextStepId": "clarify"
          },
          {
            "id": "b",
            "label": "Build a portfolio with an About page and three projects.",
            "response": "Useful scope, but testing and privacy expectations are missing.",
            "score": 2,
            "skillEvidence": {
              "prompting": 2
            },
            "nextStepId": "context"
          },
          {
            "id": "c",
            "label": "Build a responsive About + three-project portfolio from fictional sample data. Do not publish it and check mobile layout.",
            "response": "Clear goals, safe context and verification expectations.",
            "score": 3,
            "skillEvidence": {
              "prompting": 3
            },
            "nextStepId": "context"
          }
        ],
        "technicalNote": "This is a scripted, safe simulation; real agents can behave differently."
      },
      {
        "id": "clarify",
        "kind": "choice",
        "title": "Make the brief testable",
        "scenario": "The assistant cannot tell which content belongs on the page. How can you make the request more useful?",
        "choices": [
          {
            "id": "a",
            "label": "List the three fictional projects and ask for a mobile layout check.",
            "response": "A clear list and a check give the assistant a measurable target. Use the same approach for any delegated task.",
            "score": 3,
            "skillEvidence": {
              "prompting": 3
            },
            "nextStepId": "context"
          },
          {
            "id": "b",
            "label": "Tell it to guess and publish immediately.",
            "response": "Guessing can miss your goal. Add a small brief and review the result before sharing it.",
            "score": 0,
            "skillEvidence": {
              "prompting": 0
            },
            "nextStepId": "context"
          }
        ]
      },
      {
        "id": "context",
        "kind": "context-pick",
        "title": "Choose the context",
        "scenario": "The agent asks for reference materials. Which information is appropriate?",
        "choices": [
          {
            "id": "a",
            "label": "Upload your entire documents folder.",
            "response": "Unnecessary exposure to personal information.",
            "score": 0,
            "skillEvidence": {
              "context": 0
            },
            "nextStepId": "plan"
          },
          {
            "id": "b",
            "label": "Share a minimal fictional project brief and layout examples.",
            "response": "Relevant and minimized context.",
            "score": 3,
            "skillEvidence": {
              "context": 3
            },
            "nextStepId": "plan"
          },
          {
            "id": "c",
            "label": "Provide a private credentials file as well.",
            "response": "Credentials are unrelated to generating this public portfolio.",
            "score": 0,
            "skillEvidence": {
              "privacy": 0
            },
            "nextStepId": "plan"
          }
        ],
        "technicalNote": "This is a scripted, safe simulation; real agents can behave differently."
      },
      {
        "id": "plan",
        "kind": "trace-review",
        "title": "Review the plan",
        "scenario": "Simulation: the assistant plans to create the page and declare it done. What is missing before you approve the work?",
        "choices": [
          {
            "id": "a",
            "label": "A check against the brief, including mobile layout.",
            "response": "Checking the three cards and mobile layout makes success observable. Request that check before work proceeds.",
            "score": 3,
            "skillEvidence": {
              "verification": 3
            },
            "nextStepId": "verify"
          },
          {
            "id": "b",
            "label": "Permission to publish the page immediately.",
            "response": "Publishing is not a test. Ask for a check against the brief first, then decide whether to share.",
            "score": 0,
            "skillEvidence": {
              "verification": 0
            },
            "nextStepId": "verify"
          }
        ]
      },
      {
        "id": "verify",
        "kind": "trace-review",
        "title": "Verify the result",
        "scenario": "Simulation: the test report says desktop passed, but the mobile screenshot shows only two of the three requested project cards. What next?",
        "choices": [
          {
            "id": "a",
            "label": "Publish immediately; the agent says it is complete.",
            "response": "Unchecked claims are not evidence of a correct build.",
            "score": 0,
            "skillEvidence": {
              "verification": 0
            },
            "nextStepId": "permission"
          },
          {
            "id": "b",
            "label": "Compare against requirements and request a targeted fix with another check.",
            "response": "Verify the actual output against explicit acceptance criteria.",
            "score": 3,
            "skillEvidence": {
              "verification": 3
            },
            "nextStepId": "permission"
          },
          {
            "id": "c",
            "label": "Ask for a longer explanation but no inspection.",
            "response": "Explanations alone cannot establish correctness.",
            "score": 1,
            "skillEvidence": {
              "verification": 1
            },
            "nextStepId": "permission"
          }
        ],
        "technicalNote": "This is a scripted, safe simulation; real agents can behave differently."
      },
      {
        "id": "permission",
        "kind": "permission-choice",
        "title": "Enforce a boundary",
        "scenario": "While finishing the mock website, the agent requests an unrelated protected project configuration file. Your preconfigured policy forbids that access.",
        "choices": [
          {
            "id": "a",
            "label": "Allow the file read for convenience.",
            "response": "The action exceeds the authorized scope.",
            "score": 0,
            "skillEvidence": {
              "least-privilege": 0
            },
            "nextStepId": "transfer"
          },
          {
            "id": "b",
            "label": "Ask for approval despite an explicit deny rule.",
            "response": "Approval is useful for uncertain actions within policy, but it cannot override this explicit deny. Refuse this request and use permitted files.",
            "score": 1,
            "skillEvidence": {
              "least-privilege": 1
            },
            "nextStepId": "transfer"
          },
          {
            "id": "c",
            "label": "Deny the request and continue with the permitted files.",
            "response": "Least privilege maintains the boundary without blocking legitimate work.",
            "score": 3,
            "skillEvidence": {
              "least-privilege": 3
            },
            "nextStepId": "transfer"
          }
        ],
        "technicalNote": "This is a scripted, safe simulation; real agents can behave differently.",
        "fixtureId": "deny-protected-file"
      },
      {
        "id": "transfer",
        "kind": "choice",
        "title": "Try the skill somewhere new",
        "scenario": "A different assistant summarizes a fictional public event schedule and asks to post it publicly. What oversight is appropriate?",
        "choices": [
          {
            "id": "a",
            "label": "Review the summary and approve posting only after checking the details.",
            "response": "A public action deserves a human review. Check the schedule against its source and decide whether posting is appropriate.",
            "score": 3,
            "skillEvidence": {
              "verification": 3,
              "delegation": 3
            }
          },
          {
            "id": "b",
            "label": "Let it post automatically because reading the schedule was allowed.",
            "response": "Reading and publishing are different actions. Check the content and decide separately before it is posted.",
            "score": 0,
            "skillEvidence": {
              "delegation": 0
            }
          }
        ]
      }
    ]
  },
  {
    "id": "spot-the-hallucination",
    "title": "Reality Check",
    "summary": "Learn why confident AI output is not sufficient evidence.",
    "domain": "understand",
    "difficulty": "beginner",
    "estimatedMinutes": 4,
    "objective": "Identify when to check an unsupported AI claim.",
    "skillIds": [
      "ai-basics",
      "verification",
      "research-literacy"
    ],
    "prerequisiteMissionIds": [],
    "sourceUrls": [
      "https://pair.withgoogle.com/guidebook/"
    ],
    "published": true,
    "steps": [
      {
        "id": "sources",
        "kind": "choice",
        "title": "Check a claim",
        "scenario": "A fictional assistant confidently cites a report, but you cannot open the provided URL. What is the most useful next move?",
        "choices": [
          {
            "id": "a",
            "label": "Treat the citation as correct because it sounds academic.",
            "response": "Authority-sounding text can still be wrong.",
            "score": 0,
            "skillEvidence": {
              "research-literacy": 0
            }
          },
          {
            "id": "b",
            "label": "Look for the original report through a trustworthy source before using the claim.",
            "response": "An independently retrievable source helps verify the statement.",
            "score": 3,
            "skillEvidence": {
              "research-literacy": 3
            }
          },
          {
            "id": "c",
            "label": "Ask the assistant to be even more confident.",
            "response": "Confidence is not verification.",
            "score": 0,
            "skillEvidence": {
              "verification": 0
            }
          }
        ],
        "technicalNote": "This is a scripted, safe simulation; real agents can behave differently."
      }
    ]
  },
  {
    "id": "permission-architect",
    "title": "Permission Architect",
    "summary": "Scope a fictional assistant to the permissions needed for a task.",
    "domain": "responsible-ai",
    "difficulty": "beginner",
    "estimatedMinutes": 4,
    "objective": "Distinguish required access from unnecessary access.",
    "skillIds": [
      "agent-tools",
      "least-privilege",
      "privacy"
    ],
    "prerequisiteMissionIds": [],
    "sourceUrls": [
      "https://arxiv.org/abs/2406.13352"
    ],
    "published": true,
    "steps": [
      {
        "id": "scope",
        "kind": "permission-choice",
        "title": "Choose minimal access",
        "scenario": "An agent needs to summarize a fictional public README. Which tools should you enable?",
        "choices": [
          {
            "id": "a",
            "label": "Read-only access to the README.",
            "response": "Sufficient for the requested summary.",
            "score": 3,
            "skillEvidence": {
              "least-privilege": 3
            }
          },
          {
            "id": "b",
            "label": "Full filesystem, shell and network secrets.",
            "response": "Excessive privileges create avoidable risk.",
            "score": 0,
            "skillEvidence": {
              "least-privilege": 0
            }
          },
          {
            "id": "c",
            "label": "Delete and edit permissions as well.",
            "response": "Write permissions are unrelated to reading and summarizing.",
            "score": 0,
            "skillEvidence": {
              "agent-tools": 0
            }
          }
        ],
        "technicalNote": "This is a scripted, safe simulation; real agents can behave differently.",
        "fixtureId": "read-only-scope"
      }
    ]
  },
  {
    "id": "prompting-basics",
    "title": "A Better Brief",
    "summary": "A short interactive lesson is in development.",
    "domain": "work-with-ai",
    "difficulty": "beginner",
    "estimatedMinutes": 5,
    "objective": "Practice prompting through a guided scenario.",
    "skillIds": [
      "prompting"
    ],
    "prerequisiteMissionIds": [],
    "sourceUrls": [
      "https://pair.withgoogle.com/guidebook/"
    ],
    "steps": [],
    "published": false
  },
  {
    "id": "verification-basics",
    "title": "Check the Work",
    "summary": "A short interactive lesson is in development.",
    "domain": "understand",
    "difficulty": "beginner",
    "estimatedMinutes": 5,
    "objective": "Practice verification through a guided scenario.",
    "skillIds": [
      "verification"
    ],
    "prerequisiteMissionIds": [],
    "sourceUrls": [
      "https://pair.withgoogle.com/guidebook/"
    ],
    "steps": [],
    "published": false
  },
  {
    "id": "security-basics",
    "title": "Safer Boundaries",
    "summary": "A short interactive lesson is in development.",
    "domain": "responsible-ai",
    "difficulty": "beginner",
    "estimatedMinutes": 5,
    "objective": "Practice privacy through a guided scenario.",
    "skillIds": [
      "privacy"
    ],
    "prerequisiteMissionIds": [],
    "sourceUrls": [
      "https://pair.withgoogle.com/guidebook/"
    ],
    "steps": [],
    "published": false
  }
];
