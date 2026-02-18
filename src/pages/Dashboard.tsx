import { useProjects } from '../hooks/useProjects';
import DemandGauge from '../components/dashboard/DemandGauge';
import KeyMetrics from '../components/dashboard/KeyMetrics';
import WhatIfCalculator from '../components/dashboard/WhatIfCalculator';
import OversubscriptionBar from '../components/dashboard/OversubscriptionBar';
import LoadingState from '../components/shared/LoadingState';

export default function Dashboard() {
  const { data: projects = [], isLoading } = useProjects();

  if (isLoading) {
    return <LoadingState message="Loading dashboard..." />;
  }

  return (
    <div className="space-y-8">
      {/* Hero: Demand Signal Gauge */}
      <DemandGauge
        totalRequests={362}
        totalRequested={7_000_000}
        totalFunded={400_000}
      />

      {/* Key Metrics — computed from real project data */}
      <KeyMetrics projects={projects} />

      {/* Charts: state breakdown, practice mix, pipeline */}
      <OversubscriptionBar projects={projects} />

      {/* Interactive What-If Scenarios */}
      <WhatIfCalculator />
    </div>
  );
}
