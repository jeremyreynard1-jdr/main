// Operating cadence for the Expansion function.
// Illustrative — rhythms, frequencies, and artifacts proposed as a starting point.

export type Cadence = "Weekly" | "Biweekly" | "Monthly" | "Quarterly";

export type RhythmMeeting = {
  id: string;
  name: string;
  cadence: Cadence;
  day: string;
  duration: string;
  purpose: string;
  attendees: string;
  artifact: string;
};

export const rhythms: RhythmMeeting[] = [
  {
    id: "r-launch-sync",
    name: "Launch Sync",
    cadence: "Weekly",
    day: "Mon, 9:00",
    duration: "30 min",
    purpose: "Align on this-week milestones, decisions needed, new blockers.",
    attendees: "Ops + Launch Leads (per active launch)",
    artifact: "Monday Note to leadership",
  },
  {
    id: "r-blocker-review",
    name: "Blocker Review",
    cadence: "Weekly",
    day: "Wed, 15:00",
    duration: "30 min",
    purpose: "Unblock cross-functional dependencies mid-week.",
    attendees: "Ops + on-call rep from Growth / Finance / Legal / People / Product / Eng",
    artifact: "Updated Control Center RAG + action items",
  },
  {
    id: "r-exec-update",
    name: "Exec Expansion Update",
    cadence: "Weekly",
    day: "Thu, 17:00",
    duration: "Async",
    purpose: "Decision-ready update for exec team — wins, risks, decisions needed, next week.",
    attendees: "Exec team + Ops writes",
    artifact: "Weekly Update (see Playbooks module)",
  },
  {
    id: "r-launch-review",
    name: "Launch Review",
    cadence: "Biweekly",
    day: "Fri, 14:00",
    duration: "60 min",
    purpose: "Deep-dive on one launch: readiness across all functions, risks, timeline.",
    attendees: "Launch Lead, Ops, function reps, Finance/Growth observers",
    artifact: "Launch readiness snapshot + action log",
  },
  {
    id: "r-risk-review",
    name: "Risk Review",
    cadence: "Monthly",
    day: "Last Fri",
    duration: "45 min",
    purpose: "Review top risks and assumptions across expansion portfolio.",
    attendees: "Exec team + Ops",
    artifact: "RAID register update",
  },
  {
    id: "r-mbr",
    name: "Monthly Business Review (expansion segment)",
    cadence: "Monthly",
    day: "1st Mon",
    duration: "60 min",
    purpose: "Monthly actuals vs plan across launches; prioritization adjustments.",
    attendees: "Exec team + Growth + Finance + Ops",
    artifact: "MBR deck (expansion)",
  },
  {
    id: "r-mer",
    name: "Market Expansion Review (QBR)",
    cadence: "Quarterly",
    day: "End of quarter",
    duration: "Half day",
    purpose: "Quarterly review: what shipped, what slipped, what enters next quarter.",
    attendees: "Leadership offsite",
    artifact: "QBR report + next-quarter plan",
  },
];
