export interface QuarterForecast {
  quarter: string;       // e.g. "Q1 2025"
  year: number;
  qIndex: number;        // 1-4
  projectedTons: number;
  actualTons: number | null;     // null = future (no actual yet)
  projectedCredits: number;      // tCO2e
  actualCredits: number | null;
  projectedValue: number;        // $
  actualValue: number | null;
}

export interface ForecastSummary {
  totalProjectedCredits: number;
  totalActualCredits: number;
  totalProjectedValue: number;
  totalActualValue: number;
  completedQuarters: number;
  totalQuarters: number;
  status: 'on_track' | 'behind' | 'ahead';
}

export const FORECAST_DATA: QuarterForecast[] = [
  // 2025
  { quarter: 'Q1 2025', year: 2025, qIndex: 1, projectedTons: 420, actualTons: 435, projectedCredits: 38, actualCredits: 40, projectedValue: 1140, actualValue: 1200 },
  { quarter: 'Q2 2025', year: 2025, qIndex: 2, projectedTons: 680, actualTons: 650, projectedCredits: 62, actualCredits: 59, projectedValue: 1860, actualValue: 1770 },
  { quarter: 'Q3 2025', year: 2025, qIndex: 3, projectedTons: 950, actualTons: 980, projectedCredits: 86, actualCredits: 89, projectedValue: 2580, actualValue: 2670 },
  { quarter: 'Q4 2025', year: 2025, qIndex: 4, projectedTons: 780, actualTons: null, projectedCredits: 71, actualCredits: null, projectedValue: 2130, actualValue: null },
  // 2026
  { quarter: 'Q1 2026', year: 2026, qIndex: 1, projectedTons: 500, actualTons: null, projectedCredits: 45, actualCredits: null, projectedValue: 1350, actualValue: null },
  { quarter: 'Q2 2026', year: 2026, qIndex: 2, projectedTons: 820, actualTons: null, projectedCredits: 74, actualCredits: null, projectedValue: 2220, actualValue: null },
  { quarter: 'Q3 2026', year: 2026, qIndex: 3, projectedTons: 1100, actualTons: null, projectedCredits: 100, actualCredits: null, projectedValue: 3000, actualValue: null },
  { quarter: 'Q4 2026', year: 2026, qIndex: 4, projectedTons: 900, actualTons: null, projectedCredits: 82, actualCredits: null, projectedValue: 2460, actualValue: null },
  // 2027
  { quarter: 'Q1 2027', year: 2027, qIndex: 1, projectedTons: 550, actualTons: null, projectedCredits: 50, actualCredits: null, projectedValue: 1500, actualValue: null },
  { quarter: 'Q2 2027', year: 2027, qIndex: 2, projectedTons: 880, actualTons: null, projectedCredits: 80, actualCredits: null, projectedValue: 2400, actualValue: null },
  { quarter: 'Q3 2027', year: 2027, qIndex: 3, projectedTons: 1200, actualTons: null, projectedCredits: 109, actualCredits: null, projectedValue: 3270, actualValue: null },
  { quarter: 'Q4 2027', year: 2027, qIndex: 4, projectedTons: 950, actualTons: null, projectedCredits: 86, actualCredits: null, projectedValue: 2580, actualValue: null },
];

export function getForecastSummary(data: QuarterForecast[]): ForecastSummary {
  const completed = data.filter((d) => d.actualCredits !== null);
  const totalProjectedCredits = data.reduce((s, d) => s + d.projectedCredits, 0);
  const totalActualCredits = completed.reduce((s, d) => s + (d.actualCredits || 0), 0);
  const projectedForCompleted = completed.reduce((s, d) => s + d.projectedCredits, 0);
  const totalProjectedValue = data.reduce((s, d) => s + d.projectedValue, 0);
  const totalActualValue = completed.reduce((s, d) => s + (d.actualValue || 0), 0);

  let status: 'on_track' | 'behind' | 'ahead' = 'on_track';
  if (projectedForCompleted > 0) {
    const ratio = totalActualCredits / projectedForCompleted;
    if (ratio > 1.05) status = 'ahead';
    else if (ratio < 0.95) status = 'behind';
  }

  return {
    totalProjectedCredits,
    totalActualCredits,
    totalProjectedValue,
    totalActualValue,
    completedQuarters: completed.length,
    totalQuarters: data.length,
    status,
  };
}

export type TimeHorizon = '1y' | '2y' | '3y' | '5y';

export function filterByHorizon(data: QuarterForecast[], horizon: TimeHorizon): QuarterForecast[] {
  const years = horizon === '1y' ? 1 : horizon === '2y' ? 2 : horizon === '3y' ? 3 : 5;
  const startYear = 2025;
  return data.filter((d) => d.year < startYear + years);
}
