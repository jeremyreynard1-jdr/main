// Named pipeline targets. All illustrative — the firms are real but the
// pipeline state, warm-intro paths, and owners are mock.

export type Target = {
  id: string;
  firm: string;
  country: string;
  region: "NA" | "UK" | "EU" | "APAC" | "ME" | "AU";
  lat: number;
  lon: number;
  tier: "Vault" | "AmLaw-100" | "Magic-Circle" | "Silver-Circle" | "Regional" | "Global" | "Big4";
  stage: "Explore" | "Pilot" | "Planned";
  whyThem: string;
};

export const targets: Target[] = [
  {
    id: "t-kirkland",
    firm: "Kirkland & Ellis",
    country: "USA",
    region: "NA",
    lat: 41.8881,
    lon: -87.6298,
    tier: "Vault",
    stage: "Explore",
    whyThem: "Private equity deal volume; drafting workflow fits.",
  },
  {
    id: "t-skadden",
    firm: "Skadden",
    country: "USA",
    region: "NA",
    lat: 40.7614,
    lon: -73.9776,
    tier: "Vault",
    stage: "Explore",
    whyThem: "M&A workflow + global offices alignment.",
  },
  {
    id: "t-freshfields",
    firm: "Freshfields",
    country: "UK",
    region: "UK",
    lat: 51.517,
    lon: -0.104,
    tier: "Magic-Circle",
    stage: "Pilot",
    whyThem: "Magic Circle completion after Linklaters.",
  },
  {
    id: "t-clifford",
    firm: "Clifford Chance",
    country: "UK",
    region: "UK",
    lat: 51.5045,
    lon: -0.0199,
    tier: "Magic-Circle",
    stage: "Explore",
    whyThem: "Magic Circle + EU footprint.",
  },
  {
    id: "t-hengeler",
    firm: "Hengeler Mueller",
    country: "Germany",
    region: "EU",
    lat: 50.1109,
    lon: 8.6821,
    tier: "Regional",
    stage: "Planned",
    whyThem: "DACH anchor — top-tier German firm.",
  },
  {
    id: "t-gleiss",
    firm: "Gleiss Lutz",
    country: "Germany",
    region: "EU",
    lat: 48.7758,
    lon: 9.1829,
    tier: "Regional",
    stage: "Planned",
    whyThem: "DACH coverage; Stuttgart base for industrial clients.",
  },
  {
    id: "t-uria",
    firm: "Uría Menéndez",
    country: "Spain",
    region: "EU",
    lat: 40.4168,
    lon: -3.7038,
    tier: "Regional",
    stage: "Explore",
    whyThem: "Iberian coverage alongside Pérez-Llorca beachhead.",
  },
  {
    id: "t-nishimura",
    firm: "Nishimura & Asahi",
    country: "Japan",
    region: "APAC",
    lat: 35.6762,
    lon: 139.6503,
    tier: "Regional",
    stage: "Explore",
    whyThem: "APAC deepening beyond Sydney.",
  },
  {
    id: "t-kimchang",
    firm: "Kim & Chang",
    country: "South Korea",
    region: "APAC",
    lat: 37.5665,
    lon: 126.978,
    tier: "Regional",
    stage: "Explore",
    whyThem: "Korea gateway; historically Harvey-skeptical.",
  },
  {
    id: "t-ey",
    firm: "EY Law",
    country: "Global",
    region: "UK",
    lat: 51.515,
    lon: -0.1,
    tier: "Big4",
    stage: "Explore",
    whyThem: "Big 4 channel after Deloitte beachhead.",
  },
  {
    id: "t-baker",
    firm: "Baker Botts",
    country: "USA",
    region: "NA",
    lat: 29.7604,
    lon: -95.3698,
    tier: "AmLaw-100",
    stage: "Planned",
    whyThem: "Houston open — energy/PE coverage.",
  },
  {
    id: "t-vinson",
    firm: "Vinson & Elkins",
    country: "USA",
    region: "NA",
    lat: 29.7604,
    lon: -95.3698,
    tier: "AmLaw-100",
    stage: "Planned",
    whyThem: "Houston open — energy practice.",
  },
];
