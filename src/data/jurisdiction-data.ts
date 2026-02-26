export interface JurisdictionData {
  id: string;
  name: string;
  state: string;
  farmCount: number;
  totalAcres: number;
  estimatedTons: number;
  marketRate: number;          // $/tCO2e
  demonstrationProjects: number;
  foodInsecurityScore: number; // 0-100 (higher = more food insecure)
}

export const JURISDICTIONS: JurisdictionData[] = [
  {
    id: 'san-diego',
    name: 'San Diego County',
    state: 'CA',
    farmCount: 12,
    totalAcres: 2400,
    estimatedTons: 14400,
    marketRate: 32,
    demonstrationProjects: 3,
    foodInsecurityScore: 28,
  },
  {
    id: 'san-benito',
    name: 'San Benito County',
    state: 'CA',
    farmCount: 8,
    totalAcres: 4200,
    estimatedTons: 25200,
    marketRate: 30,
    demonstrationProjects: 2,
    foodInsecurityScore: 35,
  },
  {
    id: 'monterey',
    name: 'Monterey County',
    state: 'CA',
    farmCount: 15,
    totalAcres: 5800,
    estimatedTons: 34800,
    marketRate: 30,
    demonstrationProjects: 4,
    foodInsecurityScore: 32,
  },
  {
    id: 'weld',
    name: 'Weld County',
    state: 'CO',
    farmCount: 6,
    totalAcres: 3100,
    estimatedTons: 18600,
    marketRate: 28,
    demonstrationProjects: 1,
    foodInsecurityScore: 22,
  },
  {
    id: 'sacramento',
    name: 'Sacramento County',
    state: 'CA',
    farmCount: 10,
    totalAcres: 2800,
    estimatedTons: 16800,
    marketRate: 30,
    demonstrationProjects: 2,
    foodInsecurityScore: 38,
  },
  {
    id: 'marin',
    name: 'Marin County',
    state: 'CA',
    farmCount: 5,
    totalAcres: 1400,
    estimatedTons: 8400,
    marketRate: 35,
    demonstrationProjects: 2,
    foodInsecurityScore: 15,
  },
  {
    id: 'yolo',
    name: 'Yolo County',
    state: 'CA',
    farmCount: 7,
    totalAcres: 2200,
    estimatedTons: 13200,
    marketRate: 30,
    demonstrationProjects: 1,
    foodInsecurityScore: 30,
  },
];

export type CompostProjectType = 'spreading_only' | 'compost_provided' | 'combined';

export const PROJECT_TYPE_LABELS: Record<CompostProjectType, string> = {
  spreading_only: 'Spreading Only',
  compost_provided: 'Compost Provided',
  combined: 'Combined',
};

export const PROJECT_TYPE_COLORS: Record<CompostProjectType, { bg: string; text: string }> = {
  spreading_only: { bg: 'var(--zfp-green-pale)', text: 'var(--zfp-green)' },
  compost_provided: { bg: 'var(--zfp-soil-pale)', text: 'var(--zfp-soil)' },
  combined: { bg: '#EDE9FE', text: '#7C3AED' },
};

// Assign project types based on project index for demo purposes
export function getProjectType(projectId: string): CompostProjectType {
  const hash = projectId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const types: CompostProjectType[] = ['spreading_only', 'compost_provided', 'combined'];
  return types[hash % 3];
}
