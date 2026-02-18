import { useQuery } from '@tanstack/react-query';
import type { LedgerState } from '../types/ledger';

export function useRegenLedger() {
  const query = useQuery<LedgerState>({
    queryKey: ['regenLedger'],
    queryFn: async () => {
      if (import.meta.env.VITE_USE_DEMO_DATA !== 'false') {
        const data = await import('../data/demo-ledger.json');
        return data.default as LedgerState;
      }
      throw new Error('Live Regen Ledger MCP not configured');
    },
  });

  return {
    ...query,
    isConnected: query.isSuccess,
    status: query.isLoading ? 'connecting' as const : query.isSuccess ? 'online' as const : 'offline' as const,
  };
}
