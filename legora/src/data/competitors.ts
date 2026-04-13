// Competitor records for the Intel module. Facts are sourced; estimates are
// flagged illustrative: true.

export type CompetitorTag =
  | "big-logos"
  | "market-entry"
  | "product-features"
  | "pricing"
  | "funding-hires";

export type CompetitorFact = {
  text: string;
  tag: CompetitorTag;
  source?: string;
  illustrative?: boolean;
};

export type Competitor = {
  id: string;
  name: string;
  positioning: string;
  hq: string;
  founded?: string;
  headline: string;
  threat: "Direct" | "Adjacent" | "Watch";
  facts: CompetitorFact[];
};

export const competitors: Competitor[] = [
  {
    id: "harvey",
    name: "Harvey",
    positioning: "Gen-AI platform for elite law firms (OpenAI-native origin)",
    hq: "San Francisco, USA",
    founded: "2022",
    headline: "The direct competitor. 1,000+ customers, 60+ countries, 50%+ of AmLaw 100.",
    threat: "Direct",
    facts: [
      {
        text: "1,000+ customers across 60+ countries; 100,000+ lawyers; 50%+ of AmLaw 100",
        tag: "big-logos",
        source: "https://www.harvey.ai/customers",
      },
      {
        text: "Paul Weiss launched Harvey-powered custom workflows (Jun 2025)",
        tag: "big-logos",
        source: "https://www.paulweiss.com/insights/firm-news/paul-weiss-partners-with-harvey-ai-on-new-ai-workflows-innovation",
      },
      {
        text: "A&O Shearman — 3,500 lawyers, 40,000+ queries since Nov 2022 trial",
        tag: "big-logos",
        source: "https://en.wikipedia.org/wiki/Harvey_(software)",
      },
      {
        text: "Workflows product line (vertical templates) + research + drafting",
        tag: "product-features",
        source: "https://www.harvey.ai/customers",
      },
      {
        text: "Pricing typically enterprise seat-based; not listed publicly",
        tag: "pricing",
        illustrative: true,
      },
      {
        text: "US-originated; heavy AmLaw base; European push through A&O roots",
        tag: "market-entry",
        source: "https://en.wikipedia.org/wiki/Harvey_(software)",
      },
    ],
  },
  {
    id: "hebbia",
    name: "Hebbia",
    positioning: "Document-scale research for M&A and due diligence",
    hq: "New York, USA",
    founded: "2020",
    headline: "Matrix UX for large doc sets — finance and PE-law adjacent.",
    threat: "Direct",
    facts: [
      {
        text: "Core: retrieval over enterprise document sets (M&A/DD scale)",
        tag: "product-features",
        source: "https://www.spellbook.legal/briefs/hebbia-vs-harvey",
      },
      {
        text: "Estimated enterprise seat pricing $3K–$10K/user/year",
        tag: "pricing",
        source: "https://www.spellbook.legal/briefs/hebbia-vs-harvey",
      },
      {
        text: "Strong in investment banking; expanding into in-house legal + PE",
        tag: "market-entry",
        illustrative: true,
      },
    ],
  },
  {
    id: "robin",
    name: "Robin AI",
    positioning: "Contract review + automation, enterprise-grade compliance",
    hq: "London, UK",
    founded: "2019",
    headline: "Compliance-first contract AI; GDPR / SOC2 strong suit.",
    threat: "Adjacent",
    facts: [
      {
        text: "Named customers include Pfizer, UBS, KPMG (per Robin AI marketing)",
        tag: "big-logos",
        illustrative: true,
      },
      {
        text: "GDPR + SOC 2 positioning; European enterprise buyers",
        tag: "product-features",
        illustrative: true,
      },
    ],
  },
  {
    id: "spellbook",
    name: "Spellbook",
    positioning: "Contract drafting for mid-market / SMB law",
    hq: "St. John's, Canada",
    founded: "2021",
    headline: "4,000+ teams, ~$180/user/month. Different ICP — bottom-up motion.",
    threat: "Watch",
    facts: [
      {
        text: "4,000+ legal teams; SMB / mid-market distribution",
        tag: "big-logos",
        source: "https://www.spellbook.legal/learn/best-ai-tools-for-law-firms",
      },
      {
        text: "~$180 per user per month published pricing",
        tag: "pricing",
        source: "https://www.spellbook.legal/learn/best-ai-tools-for-law-firms",
      },
      {
        text: "Word add-in first; different ICP from Legora's elite-firm motion",
        tag: "product-features",
        source: "https://www.spellbook.legal/learn/best-ai-tools-for-law-firms",
      },
    ],
  },
  {
    id: "luminance",
    name: "Luminance",
    positioning: "Contract negotiation + analysis AI",
    hq: "Cambridge, UK",
    founded: "2016",
    headline: "Longtime incumbent. 'Institutional memory' launched Jan 2026.",
    threat: "Adjacent",
    facts: [
      {
        text: "Launched 'Institutional Memory' feature Jan 2026",
        tag: "product-features",
        illustrative: true,
      },
      {
        text: "UK-rooted; strong European enterprise footprint",
        tag: "market-entry",
        illustrative: true,
      },
    ],
  },
  {
    id: "cocounsel",
    name: "CoCounsel (Thomson Reuters)",
    positioning: "Westlaw-integrated agentic AI (ex-Casetext)",
    hq: "USA (Thomson Reuters)",
    founded: "2013 (Casetext)",
    headline: "Distribution moat via Westlaw + Practical Law. 20K+ users.",
    threat: "Direct",
    facts: [
      {
        text: "20,000+ users; agentic AI across Westlaw / Practical Law",
        tag: "big-logos",
        illustrative: true,
      },
      {
        text: "Bundled distribution through Thomson Reuters legal research",
        tag: "market-entry",
        illustrative: true,
      },
    ],
  },
  {
    id: "lexis",
    name: "Lexis+ AI",
    positioning: "LexisNexis research + drafting AI",
    hq: "USA (RELX)",
    founded: "2023 (Lexis+ AI)",
    headline: "65% accuracy vs Westlaw 34% in independent research benchmark.",
    threat: "Adjacent",
    facts: [
      {
        text: "Cited accuracy advantage: 65% vs Westlaw 34% (Jones Walker)",
        tag: "product-features",
        source: "https://www.joneswalker.com/en/insights/blogs/ai-law-blog/ten-ai-predictions-for-2026",
      },
      {
        text: "Distribution via existing Lexis seats — massive installed base",
        tag: "market-entry",
        illustrative: true,
      },
    ],
  },
  {
    id: "ironclad",
    name: "Ironclad",
    positioning: "CLM platform + AI agents (adjacent, not head-on)",
    hq: "San Francisco, USA",
    founded: "2014",
    headline: "Gartner CLM leader 2025. Enterprise CLM incumbent adding AI.",
    threat: "Adjacent",
    facts: [
      {
        text: "Named Gartner CLM Leader 2025",
        tag: "product-features",
        source: "https://ironcladapp.com/resources/articles/best-legal-ai-software",
      },
      {
        text: "AI agents for review / drafting / research on top of CLM base",
        tag: "product-features",
        source: "https://ironcladapp.com/resources/articles/best-legal-ai-software",
      },
    ],
  },
  {
    id: "eve",
    name: "Eve.legal",
    positioning: "Plaintiff-side case management AI",
    hq: "USA",
    headline: "Different segment (plaintiff bar). Watch, not head-on.",
    threat: "Watch",
    facts: [
      {
        text: "Plaintiff case management — distinct from elite-firm workflow",
        tag: "product-features",
        source: "https://www.eve.legal/",
      },
    ],
  },
];
