export interface FundingPot {
  id: string;
  name: string;
  totalAmount: number;
  color: string;
}

export const DEFAULT_FUNDING_POTS: FundingPot[] = [
  { id: 'pot-restore-ca', name: 'Restore CA', totalAmount: 100000, color: '#2D6A4F' },
  { id: 'pot-cdfa-hsp', name: 'CDFA HSP', totalAmount: 50000, color: '#52B788' },
  { id: 'pot-compost-connector', name: 'Compost Connector', totalAmount: 35000, color: '#8B6914' },
  { id: 'pot-san-diego', name: 'County of San Diego', totalAmount: 25000, color: '#527984' },
];

export interface ScenarioProject {
  projectId: string;
  fundingPotId: string;
  amount: number;
}

export interface Scenario {
  id: string;
  name: string;
  projects: ScenarioProject[];
}
