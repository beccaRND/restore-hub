import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import type { Funder } from '../types/funder';

async function loadFunders(): Promise<Funder[]> {
  const { default: funders } = await import('../data/demo-funders.json');
  return funders as Funder[];
}

export function useFunders() {
  return useQuery<Funder[]>({
    queryKey: ['funders'],
    queryFn: loadFunders,
  });
}

export function useFunder(slug: string) {
  const { data: funders, ...rest } = useFunders();
  const funder = useMemo(
    () => funders?.find((f) => f.slug === slug) ?? null,
    [funders, slug]
  );
  return { data: funder, ...rest };
}
