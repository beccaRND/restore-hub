export interface CompostScenario {
  tonsApplied: number;
  carbonContentPercent: number;
  acres: number;
  residualCarbonLow: number;
  residualCarbonHigh: number;
  estimatedCreditValueLow: number;
  estimatedCreditValueHigh: number;
  marketRatePerTon: number;
}

export interface CompostProtocolStep {
  step: number;
  title: string;
  description: string;
  details: string[];
}

export const COMPOST_PROTOCOL_STEPS: CompostProtocolStep[] = [
  {
    step: 1,
    title: 'Compost Sourcing & Quality',
    description: 'Verify feedstock origin, composting method, and maturity testing.',
    details: [
      'Feedstock must be food scraps, green waste, or agricultural residue',
      'Composting method: windrow, aerated static pile, or in-vessel',
      'Solvita maturity index ≥ 6 required',
      'Carbon content typically 15–25% by dry weight',
    ],
  },
  {
    step: 2,
    title: 'Application Planning',
    description: 'Calculate application rates based on soil type, crop, and climate zone.',
    details: [
      'Standard application: 4–8 tons per acre per year',
      'Soil sampling required within 12 months of application',
      'Application method: surface spread, incorporated, or side-dressed',
      'GPS-documented field boundaries required',
    ],
  },
  {
    step: 3,
    title: 'Field Application',
    description: 'Document application with photos, receipts, and GPS coordinates.',
    details: [
      'Third-party delivery receipts with tonnage',
      'Timestamped GPS tracks of application equipment',
      'Photo documentation before and after application',
      'Weather conditions recorded (no application before heavy rain)',
    ],
  },
  {
    step: 4,
    title: 'Monitoring & Verification',
    description: 'Soil carbon monitoring via sampling or remote sensing over the crediting period.',
    details: [
      'Baseline soil samples at 0–30 cm depth',
      'Follow-up sampling at 12 and 24 months',
      'COMET Planner estimates used for initial projections',
      'Third-party verification required for credit issuance',
    ],
  },
  {
    step: 5,
    title: 'Credit Issuance',
    description: 'Verified carbon sequestration is issued as credits on the Regen Ledger.',
    details: [
      'Credits denominated in tCO2e (metric tons CO2 equivalent)',
      'Residual carbon fraction: 25–45% of applied carbon remains sequestered',
      'Buffer pool: 15% of credits held for permanence risk',
      'Credits trackable via Regen Ledger IRI',
    ],
  },
  {
    step: 6,
    title: 'Market & Recovery',
    description: 'Credits are listed for sale, generating revenue that returns to the revolving fund.',
    details: [
      'Current market range: $15–$50 per tCO2e for soil carbon',
      'Intervention-based pricing may differ from market rate',
      'Revenue split: farmer share + revolving fund recovery',
      'Fund recovery enables new grant deployment',
    ],
  },
];
