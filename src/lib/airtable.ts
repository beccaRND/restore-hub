// Airtable integration module
// Phase 5: Will sync ZFP's Airtable project database
// For now, returns demo data

import { API_CONFIG } from './api';
import type { FarmProject } from '../types/project';

const BASE_URL = 'https://api.airtable.com/v0';

export async function fetchProjects(): Promise<FarmProject[]> {
  if (!API_CONFIG.airtable.apiKey || !API_CONFIG.airtable.baseId) {
    // Fall back to demo data
    const { default: projects } = await import('../data/demo-projects.json');
    return projects as FarmProject[];
  }

  // Live Airtable fetch (Phase 5)
  const response = await fetch(
    `${BASE_URL}/${API_CONFIG.airtable.baseId}/Projects`,
    {
      headers: {
        Authorization: `Bearer ${API_CONFIG.airtable.apiKey}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Airtable API error: ${response.status}`);
  }

  const data = await response.json();
  return mapAirtableRecords(data.records);
}

function mapAirtableRecords(records: Array<{ id: string; fields: Record<string, unknown> }>): FarmProject[] {
  return records.map((record) => ({
    id: record.id,
    farmName: (record.fields['Farm Name'] as string) || 'Unknown Farm',
    farmerName: record.fields['Farmer Name'] as string | undefined,
    location: {
      state: (record.fields['State'] as string) || '',
      county: (record.fields['County'] as string) || '',
      lat: (record.fields['Latitude'] as number) || 0,
      lng: (record.fields['Longitude'] as number) || 0,
    },
    practices: (record.fields['Practice Types'] as string[]) || [],
    acreage: (record.fields['Acres'] as number) || 0,
    grantAmount: (record.fields['Grant Amount'] as number) || 0,
    grantDate: (record.fields['Grant Date'] as string) || '',
    fundSource: (record.fields['Fund Source'] as string) || 'campaign',
    cometEstimate: {
      low: (record.fields['COMET Low'] as number) || 0,
      high: (record.fields['COMET High'] as number) || 0,
      unit: 'tCO2e' as const,
    },
    availability: (record.fields['Availability'] as string) || 'available',
    status: (record.fields['Status'] as string) || 'granted',
  })) as FarmProject[];
}
