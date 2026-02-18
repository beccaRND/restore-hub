export interface LedgerCreditType {
  abbreviation: string;
  name: string;
  unit: string;
  precision: number;
}

export interface LedgerCreditClass {
  id: string;
  name: string;
  creditType: string;
  projectCount: number;
  batchCount: number;
  metadata: string;
}

export interface LedgerCreditBatch {
  denom: string;
  projectId: string;
  classId: string;
  jurisdiction: string;
  startDate: string;
  endDate: string;
  issuanceDate: string;
}

export interface LedgerNetworkStats {
  totalProjects: number;
  totalCreditClasses: number;
  totalBatches: number;
  activeSellOrders: number;
  creditTypes: number;
}

export interface LedgerState {
  creditTypes: LedgerCreditType[];
  creditClasses: LedgerCreditClass[];
  recentBatches: LedgerCreditBatch[];
  networkStats: LedgerNetworkStats;
}
