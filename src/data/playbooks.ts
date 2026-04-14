// Four pre-baked playbooks + templates driving the Workflow Generator.

export type LaunchType = "new-geo" | "new-segment" | "new-icp" | "new-channel";

export type PlaybookTemplate = {
  id: string;
  launchType: LaunchType;
  target: string;
  title: string;
  oneLine: string;
  checklist: string[];
  raci: { activity: string; R: string; A: string; C: string; I: string }[];
  cadence: string[];
  metrics: { input: string[]; output: string[] };
  risks: { risk: string; mitigation: string }[];
  comms: { internal: string[]; external: string[] };
  milestones: { d30: string[]; d60: string[]; d90: string[] };
};

export const playbooks: PlaybookTemplate[] = [
  {
    id: "pb-us-scale",
    launchType: "new-geo",
    target: "US scale-up (NYC → Houston → Chicago)",
    title: "US AmLaw scale-up",
    oneLine:
      "Convert the NYC beachhead into a repeatable AmLaw flywheel; open Houston and Chicago as hub offices within 6 months.",
    checklist: [
      "Locked ICP: AmLaw 100 corporate + litigation partners",
      "Reference architecture from White & Case global rollout documented",
      "State-level entity registration (TX, IL) agent appointed",
      "Local outside counsel engaged per geography",
      "Regional comp bands + offer benchmarks confirmed",
      "Local tech stack approvals (CRM, Slack, SSO) + IT onboarding",
      "Pricing envelope confirmed with Finance (USD premium)",
      "Marketing: launch comms + regional press plan",
      "Success criteria + scorecard published before go-live",
    ],
    raci: [
      { activity: "Market sizing + target list", R: "Growth", A: "Head of Expansion", C: "Finance", I: "Exec" },
      { activity: "Entity / legal setup", R: "Legal", A: "CFO", C: "Ops", I: "People" },
      { activity: "Hiring plan (AE/CSM/SE)", R: "People", A: "Head of Expansion", C: "Growth", I: "Exec" },
      { activity: "Local pricing approval", R: "Finance", A: "CFO", C: "Growth", I: "Ops" },
      { activity: "Launch comms", R: "Marketing", A: "CMO", C: "Ops, Growth", I: "Exec" },
      { activity: "Operating cadence", R: "Ops", A: "Head of Expansion", C: "All functions", I: "Exec" },
    ],
    cadence: [
      "Weekly Launch Sync (Mon)",
      "Biweekly Launch Review (Fri)",
      "Monthly MBR segment cut",
    ],
    metrics: {
      input: [
        "Pipeline coverage (target ≥3×)",
        "AE/CSM hires closed vs plan",
        "Partner workshops run / week",
      ],
      output: [
        "New logos signed per quarter",
        "Seats live per firm at 90 days",
        "Expansion NRR at 180 days",
      ],
    },
    risks: [
      {
        risk: "Compensation inflation — lateral AE market at Harvey-touched firms",
        mitigation: "Pre-agree comp envelope with Finance; 2 backup candidates in flight per role.",
      },
      {
        risk: "Texas registration delay blocks Houston lease",
        mitigation: "Parallel-path outside counsel to ensure 2-week max slippage.",
      },
    ],
    comms: {
      internal: [
        "Weekly Monday Note + Thursday Exec Update",
        "#market-expansion-us channel",
        "Monthly MBR segment cut",
      ],
      external: [
        "Office-open press release — coordinated with PR",
        "Regional partner bar association outreach",
      ],
    },
    milestones: {
      d30: [
        "Control Center v1 live for US launches",
        "Houston lease executed",
        "2 AE backfills closed for NYC",
      ],
      d60: [
        "Houston office live with 2 AEs + 1 CSM",
        "Chicago plan of record approved",
        "First expansion-motion playbook documented from White & Case rollout",
      ],
      d90: [
        "Chicago office opened",
        "Repeatable AmLaw rollout playbook published",
        "Q+1 hiring ladder fully staffed against plan",
      ],
    },
  },
  {
    id: "pb-dach",
    launchType: "new-geo",
    target: "DACH (Germany / Austria / Switzerland)",
    title: "DACH market entry",
    oneLine:
      "Germany-first, fast-follow Austria & Switzerland. Three anchor firms signed by Q4; regulatory-grade readiness non-negotiable.",
    checklist: [
      "EU AI Act GPAI classification signed off by Legal + Product",
      "German-language eval quality validated (≥ English parity on 5 key workflows)",
      "Data residency in Frankfurt confirmed",
      "Country Lead shortlist → offer",
      "Anchor firm MOU template — reviewed by DACH outside counsel",
      "Works-council / co-determination process mapped",
      "Local PR / press plan in German business media",
    ],
    raci: [
      { activity: "Regulatory classification", R: "Legal", A: "CLO", C: "Product", I: "Exec" },
      { activity: "Product localization", R: "Product", A: "CPO", C: "Eng, Legal", I: "Growth" },
      { activity: "Country Lead hire", R: "People", A: "Head of Expansion", C: "Exec", I: "All" },
      { activity: "MOU negotiation", R: "Growth", A: "Head of Expansion", C: "Legal", I: "Exec" },
      { activity: "Works-council readiness", R: "People", A: "CHRO", C: "Legal", I: "Ops" },
    ],
    cadence: [
      "Weekly Launch Sync",
      "Biweekly Legal/Product sync on regulatory",
      "Monthly Exec update",
    ],
    metrics: {
      input: [
        "Anchor-firm MOUs in motion",
        "Product eval parity score (DE vs EN)",
        "Regulatory artifacts complete (%)",
      ],
      output: [
        "Anchor firms signed",
        "Seats live at 120 days",
        "Zero regulatory exceptions on go-live",
      ],
    },
    risks: [
      {
        risk: "EU AI Act reclassification late-cycle",
        mitigation: "Engage Brussels policy counsel now; scenario-plan both GPAI and non-GPAI paths.",
      },
      {
        risk: "Country Lead search slips",
        mitigation: "Two search firms in parallel; interim contractor lined up.",
      },
    ],
    comms: {
      internal: ["#market-expansion-dach channel", "Weekly Monday Note"],
      external: [
        "Frankfurt PR launch when anchor firm #1 signs",
        "DACH bar association outreach",
      ],
    },
    milestones: {
      d30: [
        "GPAI classification memo published",
        "Country Lead offer accepted",
        "DE eval parity validated on top-3 workflows",
      ],
      d60: [
        "Anchor firm #1 MOU signed",
        "Frankfurt office lease executed",
        "Works-council readiness complete",
      ],
      d90: [
        "Anchor firm #2 in pilot",
        "Austria + Switzerland discovery launched",
        "German press launch executed",
      ],
    },
  },
  {
    id: "pb-portal",
    launchType: "new-segment",
    target: "Portal (in-house / corporate legal)",
    title: "Portal GA — in-house scale",
    oneLine:
      "Graduate Portal from design-partner cohort to GA. Distinct motion from AmLaw — buyers, pricing, success metrics all different.",
    checklist: [
      "GA scope frozen + P1 bug burndown complete",
      "Concurrent-org scale test passed (target 100)",
      "In-house pricing tiers approved (usage vs seat)",
      "Design partners graduated + testimonials",
      "CSM coverage model for in-house ICP defined",
      "Product marketing: Portal-specific narrative + collateral",
      "Support escalation path mapped",
    ],
    raci: [
      { activity: "GA readiness", R: "Product", A: "GM Portal", C: "Eng, Ops", I: "Exec" },
      { activity: "Pricing model", R: "Finance", A: "CFO", C: "Growth, GM Portal", I: "Exec" },
      { activity: "Design-partner graduation", R: "GM Portal", A: "Head of Expansion", C: "Growth", I: "Exec" },
      { activity: "GA launch comms", R: "Marketing", A: "CMO", C: "Ops, GM Portal", I: "Exec" },
    ],
    cadence: [
      "Weekly Portal ship review",
      "Biweekly GTM readiness",
      "GA launch war-room (daily T-10 → T+3)",
    ],
    metrics: {
      input: ["P1 bugs open", "Concurrent-org scale test", "CSM capacity"],
      output: [
        "Portal logos signed",
        "Usage activation rate at 30 days",
        "NRR at 180 days",
      ],
    },
    risks: [
      {
        risk: "Usage-based pricing complexity bogs deals",
        mitigation: "Ship a flat-seat alternative tier on day 1; monitor mix for 90 days.",
      },
      {
        risk: "Design partners don't convert",
        mitigation: "Explicit graduation plan per partner with owner + deadline.",
      },
    ],
    comms: {
      internal: ["#portal-ga channel", "Daily war-room update T-10 to T+3"],
      external: ["GA launch press + customer webinar", "In-house legal community (ACC)"],
    },
    milestones: {
      d30: ["Scale test passed", "Pricing approved", "GA launch plan signed off"],
      d60: ["GA live", "First 5 non-design-partner logos signed", "Support KPIs green"],
      d90: [
        "Design partners 100% graduated",
        "Portal motion playbook v1 published",
        "Portal-specific expansion targets set for Q+1",
      ],
    },
  },
  {
    id: "pb-big4",
    launchType: "new-channel",
    target: "Big 4 (Deloitte / EY / PwC / KPMG)",
    title: "Big 4 channel",
    oneLine:
      "Deepen Deloitte beachhead and open EY / PwC / KPMG. Co-sell, not reseller — keep land motion with Legora Growth.",
    checklist: [
      "Co-sell MSA template drafted (not reseller)",
      "Deloitte expansion plan — verticals & geographies",
      "Partnership exec appointed + compensation model",
      "Reference wins from Deloitte Legal packaged",
      "Big 4 counter-positioning vs Harvey / CoCounsel",
    ],
    raci: [
      { activity: "MSA template", R: "Legal", A: "CLO", C: "Partnerships", I: "Exec" },
      { activity: "Deloitte expansion", R: "Partnerships", A: "Head of Expansion", C: "Growth", I: "Exec" },
      { activity: "EY / PwC / KPMG discovery", R: "Partnerships", A: "Head of Expansion", C: "Growth", I: "Exec" },
      { activity: "Co-sell compensation design", R: "Finance", A: "CFO", C: "Partnerships", I: "Exec" },
    ],
    cadence: ["Monthly partnership review", "Quarterly Big 4 exec roundtable"],
    metrics: {
      input: ["Joint-pursuit pipeline", "Enabled Big 4 practitioners", "Partner-sourced meetings"],
      output: ["Co-sell-sourced ARR", "Partner-referred logos signed"],
    },
    risks: [
      {
        risk: "Big 4 builds or buys competing product",
        mitigation: "Co-build clauses in MSA; maintain optionality with multiple Big 4.",
      },
      {
        risk: "Channel conflict with direct motion",
        mitigation: "Clear named-account carve-outs; weekly conflict review.",
      },
    ],
    comms: {
      internal: ["#big4-channel", "Monthly partnership review deck"],
      external: ["Co-branded case studies (starting with Deloitte Legal)"],
    },
    milestones: {
      d30: ["Co-sell MSA template signed off internally", "Deloitte expansion plan approved"],
      d60: ["EY discovery call complete", "First co-sourced opp in pipeline"],
      d90: ["One of EY/PwC/KPMG in pilot MSA", "Big 4 channel playbook v1 published"],
    },
  },
];

export const launchTypes: { value: LaunchType; label: string }[] = [
  { value: "new-geo", label: "New geography" },
  { value: "new-segment", label: "New segment" },
  { value: "new-icp", label: "New ICP" },
  { value: "new-channel", label: "New channel" },
];
