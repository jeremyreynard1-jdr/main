// Launch records for the Launch Control Center.
// All launches are ILLUSTRATIVE scenarios demonstrating the operating model.
// Real public context (NYC opened Mar 2025; Houston + Chicago next; Series D
// $550M Mar 2026) informs the shape of these records but the cross-functional
// readiness values are mock.

export type Func = "Growth" | "Finance" | "Legal" | "People" | "Product" | "Eng";

export type RAG = "green" | "amber" | "red" | "na";

export type LaunchStage =
  | "Discover"
  | "Scope"
  | "Build Plan"
  | "Launch"
  | "Scale"
  | "Retro";

export type Launch = {
  id: string;
  name: string;
  scope: string;
  stage: LaunchStage;
  owner: string;
  nextMilestone: string;
  nextMilestoneDue: string; // e.g. "Apr 24"
  readiness: Record<Func, { status: RAG; note?: string; owner?: string }>;
  blocker?: string;
  decisionNeeded?: string;
  tags: string[];
};

export const functions: Func[] = [
  "Growth",
  "Finance",
  "Legal",
  "People",
  "Product",
  "Eng",
];

export const launches: Launch[] = [
  {
    id: "nyc-scale",
    name: "NYC scale-up",
    scope: "Convert the NYC foothold into the AmLaw flywheel — 40→120 seats across named accounts.",
    stage: "Scale",
    owner: "Growth Lead (NYC)",
    nextMilestone: "Q2 ACV forecast review",
    nextMilestoneDue: "Apr 24",
    readiness: {
      Growth: { status: "green", note: "Pipeline 3.1× coverage" },
      Finance: { status: "green" },
      Legal: { status: "green" },
      People: { status: "amber", note: "2 AE reqs open" },
      Product: { status: "green" },
      Eng: { status: "green" },
    },
    tags: ["US", "AmLaw-100", "existing-market"],
  },
  {
    id: "houston",
    name: "Houston office open",
    scope: "Stand up Houston hub to serve energy/PE cluster. 2 AEs, 1 CSM, 1 SE by Q3.",
    stage: "Build Plan",
    owner: "Head of Expansion",
    nextMilestone: "Lease executed",
    nextMilestoneDue: "May 2",
    readiness: {
      Growth: { status: "green" },
      Finance: { status: "amber", note: "Budget approved; local taxes pending" },
      Legal: { status: "red", note: "TX entity registration open" },
      People: { status: "amber", note: "Country lead offer out" },
      Product: { status: "green" },
      Eng: { status: "green" },
    },
    blocker: "TX registration agent needs appointment before lease signature.",
    decisionNeeded: "Pick local outside counsel: Baker Botts vs Vinson & Elkins.",
    tags: ["US", "new-geo", "Houston"],
  },
  {
    id: "chicago",
    name: "Chicago office open",
    scope: "Midwest AmLaw hub; follows Houston by ~6 weeks.",
    stage: "Scope",
    owner: "Head of Expansion",
    nextMilestone: "Local market sizing signed off",
    nextMilestoneDue: "May 10",
    readiness: {
      Growth: { status: "amber" },
      Finance: { status: "amber" },
      Legal: { status: "na" },
      People: { status: "na" },
      Product: { status: "green" },
      Eng: { status: "green" },
    },
    tags: ["US", "new-geo", "Chicago"],
  },
  {
    id: "dach",
    name: "DACH entry",
    scope: "Germany-first, Austria/Switzerland fast-follow. Target 3 anchor firms by Q4.",
    stage: "Build Plan",
    owner: "EU Expansion Lead",
    nextMilestone: "Anchor firm MOU #1 signed",
    nextMilestoneDue: "Jun 15",
    readiness: {
      Growth: { status: "amber" },
      Finance: { status: "green" },
      Legal: { status: "red", note: "EU AI Act GPAI classification review" },
      People: { status: "amber", note: "Country Lead shortlist 3/5" },
      Product: { status: "amber", note: "German-language eval pending" },
      Eng: { status: "green" },
    },
    blocker: "EU AI Act GPAI classification — Legal + Product alignment.",
    decisionNeeded: "Frankfurt vs Munich for first office footprint.",
    tags: ["EU", "new-geo", "DACH", "regulated"],
  },
  {
    id: "portal-scale",
    name: "Portal — in-house scale",
    scope: "Graduate Portal from design-partner cohort to GA for corporate legal.",
    stage: "Launch",
    owner: "GM, Portal",
    nextMilestone: "GA launch comms",
    nextMilestoneDue: "May 6",
    readiness: {
      Growth: { status: "green" },
      Finance: { status: "green" },
      Legal: { status: "green" },
      People: { status: "green" },
      Product: { status: "amber", note: "Final bug burndown — 4 P1 open" },
      Eng: { status: "amber", note: "Scale test to 50 concurrent orgs" },
    },
    decisionNeeded: "Tiered pricing: usage vs flat seat for in-house GA.",
    tags: ["new-segment", "in-house", "Portal"],
  },
  {
    id: "big4",
    name: "Big 4 channel",
    scope: "Deepen Deloitte Legal beachhead + open EY / PwC / KPMG conversations.",
    stage: "Discover",
    owner: "Partnerships",
    nextMilestone: "EY discovery call",
    nextMilestoneDue: "Apr 28",
    readiness: {
      Growth: { status: "amber" },
      Finance: { status: "na" },
      Legal: { status: "amber", note: "Co-sell MSA template needed" },
      People: { status: "na" },
      Product: { status: "green" },
      Eng: { status: "na" },
    },
    tags: ["new-channel", "Big4"],
  },
  {
    id: "apac-syd",
    name: "Sydney scale",
    scope: "Convert MinterEllison + Allens beachheads into regional expansion platform.",
    stage: "Scale",
    owner: "APAC Lead",
    nextMilestone: "2nd anchor firm signed",
    nextMilestoneDue: "May 30",
    readiness: {
      Growth: { status: "green" },
      Finance: { status: "green" },
      Legal: { status: "green" },
      People: { status: "green" },
      Product: { status: "green" },
      Eng: { status: "green" },
    },
    tags: ["APAC", "existing-market"],
  },
  {
    id: "mena",
    name: "MENA exploration",
    scope: "Leverage Al Tamimi beachhead — scope GCC regulatory + commercial fit.",
    stage: "Discover",
    owner: "Head of Expansion",
    nextMilestone: "Regulatory heatmap v1",
    nextMilestoneDue: "Jun 1",
    readiness: {
      Growth: { status: "amber" },
      Finance: { status: "na" },
      Legal: { status: "amber", note: "Data residency per-emirate review" },
      People: { status: "na" },
      Product: { status: "na" },
      Eng: { status: "na" },
    },
    tags: ["ME", "explore", "regulated"],
  },
];

export const stageOrder: LaunchStage[] = [
  "Discover",
  "Scope",
  "Build Plan",
  "Launch",
  "Scale",
  "Retro",
];
