import { CARBON_EQUIVALENTS } from './constants';

export function formatCurrency(amount: number): string {
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(0)}K`;
  }
  return `$${amount.toLocaleString()}`;
}

export function formatCurrencyFull(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

export function formatAcres(acres: number): string {
  return `${formatNumber(acres)} acres`;
}

export function formatCarbonRange(low: number, high: number): string {
  return `${formatNumber(Math.round(low))}–${formatNumber(Math.round(high))} tCO2e`;
}

export function carbonToCars(tco2e: number): number {
  return Math.round(tco2e * CARBON_EQUIVALENTS.carsPerTon);
}

export function carbonToTrees(tco2e: number): number {
  return Math.round(tco2e * CARBON_EQUIVALENTS.treesPerTon);
}

export function carbonToMiles(tco2e: number): number {
  return Math.round(tco2e * CARBON_EQUIVALENTS.milesPerTon);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatShortDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  });
}
