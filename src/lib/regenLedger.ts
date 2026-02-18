// Regen Ledger integration client
// In demo mode: loads from demo-ledger.json
// In production: connects to regen-python-mcp server via MCP protocol

import { API_CONFIG } from './api';
import type { LedgerCreditClass, LedgerCreditBatch } from '../types/ledger';

export class RegenLedger {
  private url: string;

  constructor(url?: string) {
    this.url = url || API_CONFIG.regenLedger.url;
  }

  get isAvailable(): boolean {
    return Boolean(this.url);
  }

  async queryCreditClasses(): Promise<LedgerCreditClass[]> {
    if (!this.isAvailable) return [];
    // In production, this would call the MCP server:
    // POST ${this.url}/tools/list_classes
    return [];
  }

  async queryProject(_projectId: string): Promise<unknown | null> {
    if (!this.isAvailable) return null;
    // In production: POST ${this.url}/tools/list_projects with filter
    return null;
  }

  async resolveIRI(_iri: string): Promise<unknown | null> {
    if (!this.isAvailable) return null;
    // In production: resolve content-addressable IRI to metadata
    return null;
  }

  async queryMarketplace(): Promise<unknown[]> {
    if (!this.isAvailable) return [];
    // In production: POST ${this.url}/tools/list_sell_orders
    return [];
  }

  async queryCreditBatches(_classId?: string): Promise<LedgerCreditBatch[]> {
    if (!this.isAvailable) return [];
    // In production: POST ${this.url}/tools/list_credit_batches
    return [];
  }
}

// Singleton for app-wide use
export const regenLedger = new RegenLedger();
