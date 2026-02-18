import type { PracticeType } from './project';

export interface Funder {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  description: string;
  partnerSince: string;
  contributionTotal: number;
  regions: string[];
  projectsSupported: number;
  acresImpacted: number;
  practiceBreakdown: Partial<Record<PracticeType, number>>;
  collectiveImpact: {
    estimatedCarbonLow: number;
    estimatedCarbonHigh: number;
  };
  storyNarrative?: string;
}
