import { useMemo } from 'react';
import { useProjects } from '../hooks/useProjects';
import DemandGauge from '../components/dashboard/DemandGauge';
import KeyMetrics from '../components/dashboard/KeyMetrics';
import WhatIfCalculator from '../components/dashboard/WhatIfCalculator';
import OversubscriptionBar from '../components/dashboard/OversubscriptionBar';
import LoadingState from '../components/shared/LoadingState';
import { useDemoMode } from '../context/DemoModeContext';

export default function Dashboard() {
  const { data: projects = [], isLoading } = useProjects();
  const { demoScale, demoFarmName, enabled: demoEnabled } = useDemoMode();

  // When demo mode is active, transform project data with overrides
  const displayProjects = useMemo(() => {
    if (!demoEnabled) return projects;
    return projects.map((p, i) => ({
      ...p,
      farmName: demoFarmName(p.farmName, i),
      grantAmount: demoScale(p.grantAmount),
    }));
  }, [projects, demoEnabled, demoFarmName, demoScale]);

  if (isLoading) {
    return <LoadingState message="Loading dashboard..." />;
  }

  return (
    <div className="space-y-8">
      {/* Hero: Demand Signal Gauge */}
      <DemandGauge
        totalRequests={demoScale(362)}
        totalRequested={demoScale(7_000_000)}
        totalFunded={demoScale(400_000)}
      />

      {/* Key Metrics — computed from real project data */}
      <KeyMetrics projects={displayProjects} />

      {/* Charts: state breakdown, practice mix, pipeline */}
      <OversubscriptionBar projects={displayProjects} />

      {/* Interactive What-If Scenarios */}
      <WhatIfCalculator />
    </div>
  );
}
