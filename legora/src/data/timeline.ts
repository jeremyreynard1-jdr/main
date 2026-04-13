// 30-60-90 day plan — the closer. Each milestone deep-links back to the
// relevant module so Vilgot can see what the deliverable would actually be.

export type Milestone = {
  id: string;
  day: number;
  title: string;
  detail: string;
  deliverable: string;
  successMetric: string;
  linkTo: { href: string; label: string };
};

export const milestones: Milestone[] = [
  {
    id: "d7",
    day: 7,
    title: "Land + learn",
    detail:
      "Ride along on every active launch. Talk to Growth, Finance, Legal, People, Product, Eng leads.",
    deliverable: "Launch inventory + readiness snapshot v0",
    successMetric: "6 function leads met · every launch mapped",
    linkTo: { href: "/", label: "Control Center" },
  },
  {
    id: "d14",
    day: 14,
    title: "Control Center v1",
    detail:
      "Stand up the cross-functional launch readiness tracker. One source of truth.",
    deliverable: "Readiness grid + stage board + decision log live",
    successMetric: "Every launch has an owner, stage, and next milestone",
    linkTo: { href: "/", label: "Control Center" },
  },
  {
    id: "d21",
    day: 21,
    title: "Operating rhythm installed",
    detail:
      "Weekly Launch Sync · Wednesday Blocker Review · Thursday Exec Update.",
    deliverable: "Cadence live + first Thursday exec update shipped",
    successMetric: "100% function attendance for 2 consecutive weeks",
    linkTo: { href: "/", label: "Rhythm calendar" },
  },
  {
    id: "d30",
    day: 30,
    title: "First expansion playbook",
    detail:
      "Capture the US scale-up playbook — reusable for Houston / Chicago.",
    deliverable: "Playbook v1 published",
    successMetric: "Houston lead uses it as plan-of-record",
    linkTo: { href: "/playbooks", label: "Playbook Generator" },
  },
  {
    id: "d45",
    day: 45,
    title: "Competitive signal system",
    detail:
      "Codify the Signals intake → weekly digest for leadership.",
    deliverable: "Signals feed + weekly digest shipped",
    successMetric: "Top 5 competitive moves surfaced ≤ 72h of news",
    linkTo: { href: "/signals", label: "Signals feed" },
  },
  {
    id: "d60",
    day: 60,
    title: "DACH entry plan of record",
    detail:
      "Use the playbook to build DACH plan with Growth/Finance; classify regulatory path.",
    deliverable: "DACH playbook + RAID + exec sign-off",
    successMetric: "Exec approval + Legal green on GPAI path",
    linkTo: { href: "/playbooks", label: "Playbook Generator" },
  },
  {
    id: "d75",
    day: 75,
    title: "Portal GA runway clear",
    detail:
      "War-room the Portal GA launch (T-10 to T+3) alongside GM Portal.",
    deliverable: "GA executed cleanly — no regretted incidents",
    successMetric: "Zero P0s at launch; 5 non-design-partner logos within 30d",
    linkTo: { href: "/", label: "Portal launch" },
  },
  {
    id: "d90",
    day: 90,
    title: "Repeatable expansion OS",
    detail:
      "Hand off a portable operating system: Control Center + 4 playbooks + rhythm + signals.",
    deliverable: "Expansion OS v1 published internally",
    successMetric:
      "New launches onboarded in < 2 weeks; Vilgot + exec use it without me",
    linkTo: { href: "/", label: "Control Center" },
  },
];
