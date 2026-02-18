import { useQuery } from '@tanstack/react-query';
import type { RevolvingFundState } from '../types/fund';

export function useFundMetrics() {
  return useQuery<RevolvingFundState>({
    queryKey: ['fundMetrics'],
    queryFn: async () => {
      if (import.meta.env.VITE_USE_DEMO_DATA !== 'false') {
        const data = await import('../data/demo-fund-state.json');
        return data.default as RevolvingFundState;
      }
      throw new Error('Live API not configured');
    },
  });
}
