// Central API configuration
// Manages data source routing: demo data vs. live APIs

const USE_DEMO_DATA = import.meta.env.VITE_USE_DEMO_DATA !== 'false';

export function isDemoMode(): boolean {
  return USE_DEMO_DATA;
}

export const API_CONFIG = {
  airtable: {
    apiKey: import.meta.env.VITE_AIRTABLE_API_KEY || '',
    baseId: import.meta.env.VITE_AIRTABLE_BASE_ID || '',
  },
  regenKOI: {
    url: import.meta.env.VITE_REGEN_KOI_MCP_URL || '',
  },
  mapbox: {
    token: import.meta.env.VITE_MAPBOX_TOKEN || '',
  },
};
