import { useState, useMemo } from 'react';
import type { CompostScenario } from '../types/compost';

export function useCompostCalculator() {
  const [acres, setAcres] = useState(100);
  const [tonsPerAcre, setTonsPerAcre] = useState(6);
  const [carbonContentPercent, setCarbonContentPercent] = useState(20);
  const [residualLow, setResidualLow] = useState(25);
  const [residualHigh, setResidualHigh] = useState(45);
  const [marketRate, setMarketRate] = useState(30);

  const scenario = useMemo<CompostScenario>(() => {
    const tonsApplied = acres * tonsPerAcre;
    const carbonApplied = tonsApplied * (carbonContentPercent / 100);
    // Convert carbon content to CO2e: multiply by 3.67 (molecular weight ratio CO2/C)
    const co2eLow = carbonApplied * (residualLow / 100) * 3.67;
    const co2eHigh = carbonApplied * (residualHigh / 100) * 3.67;
    return {
      tonsApplied,
      carbonContentPercent,
      acres,
      residualCarbonLow: co2eLow,
      residualCarbonHigh: co2eHigh,
      estimatedCreditValueLow: co2eLow * marketRate,
      estimatedCreditValueHigh: co2eHigh * marketRate,
      marketRatePerTon: marketRate,
    };
  }, [acres, tonsPerAcre, carbonContentPercent, residualLow, residualHigh, marketRate]);

  return {
    scenario,
    acres, setAcres,
    tonsPerAcre, setTonsPerAcre,
    carbonContentPercent, setCarbonContentPercent,
    residualLow, setResidualLow,
    residualHigh, setResidualHigh,
    marketRate, setMarketRate,
  };
}
