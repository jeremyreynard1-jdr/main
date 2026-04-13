// Signals Feed — continuous intel stream. Real items are sourced; ops-perspective
// synthesis and impact chips are mine (opinions, not facts).

export type SignalType =
  | "competitor-hire"
  | "firm-rfp"
  | "partnership"
  | "funding"
  | "product-launch"
  | "regulatory"
  | "media";

export type SignalImpact = "Monitor" | "Act" | "Escalate";

export type SignalCategory =
  | "Harvey"
  | "Legora"
  | "Other competitor"
  | "Customer"
  | "Regulator"
  | "Media";

export type Signal = {
  id: string;
  date: string; // ISO
  category: SignalCategory;
  type: SignalType;
  headline: string;
  soWhat: string;
  impact: SignalImpact;
  source?: string;
  illustrative?: boolean;
  region?: "NA" | "UK" | "EU" | "APAC" | "ME" | "AU" | "Global";
};

export const signals: Signal[] = [
  {
    id: "sig-1",
    date: "2026-03-10",
    category: "Legora",
    type: "funding",
    headline: "Legora raises $550M Series D at $5.55B valuation, led by Accel",
    soWhat:
      "Mandate to deploy capital into US + hiring. Expansion function should update the org plan within 2 weeks to absorb the Series D tailwind.",
    impact: "Act",
    source:
      "https://techcrunch.com/2026/03/10/legora-reaches-5-55-billion-valuation-as-ai-legaltech-boom-endures",
    region: "Global",
  },
  {
    id: "sig-2",
    date: "2026-03-10",
    category: "Legora",
    type: "product-launch",
    headline: "Legora launches Portal — collaborative in-house legal workspace",
    soWhat:
      "New segment (in-house / corporate legal). Ops must stand up a distinct playbook — the AmLaw motion doesn't port.",
    impact: "Act",
    source: "https://legora.com/newsroom/portal-announcement",
    region: "Global",
  },
  {
    id: "sig-3",
    date: "2026-03-03",
    category: "Customer",
    type: "partnership",
    headline:
      "Husch Blackwell announces firmwide rollout of Legora",
    soWhat:
      "Proof point for the mid-AmLaw motion. Templatize the land+rollout playbook from this deal before the next 5 firms sign.",
    impact: "Act",
    source:
      "https://www.businesswire.com/news/home/20260303743340/en/Husch-Blackwell-Continues-Tech-Expansion-and-Firmwide-Use-of-AI-with-Rollout-of-Legora",
    region: "NA",
  },
  {
    id: "sig-4",
    date: "2026-02-20",
    category: "Customer",
    type: "partnership",
    headline: "White & Case rolls out Legora globally across 43 offices",
    soWhat:
      "Largest global rollout yet. Capture the cross-jurisdiction rollout playbook in a permanent asset — it will be re-used for every global firm deal.",
    impact: "Act",
    source:
      "https://legora.com/newsroom/white-case-announces-global-rollout-of-legora-across-43-offices",
    region: "Global",
  },
  {
    id: "sig-5",
    date: "2026-01-15",
    category: "Other competitor",
    type: "product-launch",
    headline: "Luminance launches 'Institutional Memory' feature",
    soWhat:
      "Incumbent moving up-stack into workflow intelligence. Add to competitive tracker; sales enablement needs a one-pager differentiator.",
    impact: "Monitor",
    source: "https://www.streamline.ai/blog/best-ai-for-legal-teams",
    region: "UK",
  },
  {
    id: "sig-6",
    date: "2025-06-05",
    category: "Harvey",
    type: "product-launch",
    headline:
      "Paul Weiss partners with Harvey on custom workflows — first of its kind",
    soWhat:
      "Harvey moves from horizontal AI to bespoke workflows for a flagship logo. Raises the bar for 'deeply embedded' partnerships — counter with the design-partner motion.",
    impact: "Act",
    source:
      "https://www.paulweiss.com/insights/firm-news/paul-weiss-partners-with-harvey-ai-on-new-ai-workflows-innovation",
    region: "NA",
  },
  {
    id: "sig-7",
    date: "2026-04-02",
    category: "Harvey",
    type: "competitor-hire",
    headline: "Harvey opens Frankfurt office; hires ex-Linklaters partner as DACH lead",
    soWhat:
      "DACH is now contested. Accelerate our DACH entry launch; flag to Growth for MOU timelines.",
    impact: "Escalate",
    illustrative: true,
    region: "EU",
  },
  {
    id: "sig-8",
    date: "2026-03-28",
    category: "Regulator",
    type: "regulatory",
    headline: "EU AI Act GPAI guidelines — Phase 2 compliance tests go live",
    soWhat:
      "Legal + Product must confirm Legora classification + documentation. Block on DACH entry if not resolved in 21 days.",
    impact: "Escalate",
    illustrative: true,
    region: "EU",
  },
  {
    id: "sig-9",
    date: "2026-04-07",
    category: "Customer",
    type: "firm-rfp",
    headline: "Vault 100 firm issues firmwide AI RFP — 18-month evaluation window",
    soWhat:
      "Deals team needs to mobilize; Ops should instrument an RFP response playbook (rare but high-stakes).",
    impact: "Act",
    illustrative: true,
    region: "NA",
  },
  {
    id: "sig-10",
    date: "2026-04-09",
    category: "Media",
    type: "media",
    headline:
      "Financial Times: 'The AI Gold Rush Reshaping Big Law' — features Legora, Harvey, Hebbia",
    soWhat:
      "Circulate to leadership; pull quotes for sales enablement.",
    impact: "Monitor",
    illustrative: true,
    region: "Global",
  },
];

export const signalCategories: SignalCategory[] = [
  "Harvey",
  "Legora",
  "Other competitor",
  "Customer",
  "Regulator",
  "Media",
];
