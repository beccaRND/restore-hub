export const APP_NAME = 'Restore Hub';

export const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: 'LayoutDashboard' as const },
  { path: '/projects', label: 'Projects', icon: 'Sprout' as const },
  { path: '/stories', label: 'Funder Impact', icon: 'BookOpen' as const },
  { path: '/fund', label: 'Revolving Fund', icon: 'RefreshCcw' as const },
  { path: '/compost', label: 'Compost Protocol', icon: 'FlaskConical' as const },
  { path: '/grants', label: 'Grant Tracker', icon: 'ClipboardList' as const },
  { path: '/map', label: 'Project Map', icon: 'MapPin' as const },
  { path: '/settings', label: 'Settings', icon: 'Settings' as const },
] as const;

export const CHART_COLORS = [
  '#2D6A4F',
  '#52B788',
  '#8B6914',
  '#C9A227',
  '#40916C',
  '#95D5B2',
];

export const STATES = ['CA', 'CO', 'OR', 'WA', 'NY'] as const;

export const CARBON_EQUIVALENTS = {
  carsPerTon: 0.216, // cars removed per tCO2e per year
  treesPerTon: 16.5, // trees planted per tCO2e
  milesPerTon: 2481, // car miles avoided per tCO2e
};
