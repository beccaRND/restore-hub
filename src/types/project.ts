export interface FarmProject {
  id: string;
  farmName: string;
  farmerName?: string;
  location: {
    state: string;
    county: string;
    lat: number;
    lng: number;
  };
  practices: PracticeType[];
  acreage: number;
  grantAmount: number;
  grantDate: string;
  fundSource: FundSource;
  cometEstimate: {
    low: number;
    high: number;
    unit: 'tCO2e';
  };
  availability: AvailabilityStatus;
  status: ProjectStage;
  heroImage?: string;
  story?: string;
  soilSamples?: boolean;
  regenLedgerIRI?: string;
  regenProjectId?: string;
}

export type PracticeType =
  | 'compost_application'
  | 'cover_cropping'
  | 'managed_grazing'
  | 'hedgerow_planting'
  | 'windbreaks'
  | 'silvopasture'
  | 'reduced_tillage'
  | 'nutrient_management'
  | 'riparian_buffer';

export type FundSource =
  | 'restore_ca'
  | 'restore_co'
  | 'restore_nw'
  | 'restore_or'
  | 'cdfa_hsp'
  | 'compost_connector'
  | 'campaign';

export type AvailabilityStatus =
  | 'available'
  | 'in_conversation'
  | 'committed'
  | 'private';

export type ProjectStage =
  | 'granted'
  | 'implementing'
  | 'implemented'
  | 'listed'
  | 'interest_received'
  | 'credit_issued'
  | 'credit_sold'
  | 'recouped';

export const PRACTICE_LABELS: Record<PracticeType, string> = {
  compost_application: 'Compost Application',
  cover_cropping: 'Cover Cropping',
  managed_grazing: 'Managed Grazing',
  hedgerow_planting: 'Hedgerow Planting',
  windbreaks: 'Windbreaks',
  silvopasture: 'Silvopasture',
  reduced_tillage: 'Reduced Tillage',
  nutrient_management: 'Nutrient Management',
  riparian_buffer: 'Riparian Buffer',
};

export const FUND_SOURCE_LABELS: Record<FundSource, string> = {
  restore_ca: 'Restore CA',
  restore_co: 'Restore CO',
  restore_nw: 'Restore NW',
  restore_or: 'Restore OR',
  cdfa_hsp: 'CDFA HSP',
  compost_connector: 'Compost Connector',
  campaign: 'Campaign',
};

export const AVAILABILITY_LABELS: Record<AvailabilityStatus, string> = {
  available: 'Available',
  in_conversation: 'In Conversation',
  committed: 'Committed',
  private: 'Private',
};

export const STAGE_LABELS: Record<ProjectStage, string> = {
  granted: 'Granted',
  implementing: 'Implementing',
  implemented: 'Implemented',
  listed: 'Listed',
  interest_received: 'Interest Received',
  credit_issued: 'Credit Issued',
  credit_sold: 'Credit Sold',
  recouped: 'Recouped',
};
