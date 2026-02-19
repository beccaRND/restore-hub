import { RefreshCcw } from 'lucide-react';
import { useFundMetrics } from '../hooks/useFundMetrics';
import { useProjects } from '../hooks/useProjects';
import FundMetrics from '../components/fund/FundMetrics';
import FlowDiagram from '../components/fund/FlowDiagram';
import ProjectStageTracker from '../components/fund/ProjectStage';
import FundSourceBreakdown from '../components/fund/FundSourceBreakdown';
import LoadingState from '../components/shared/LoadingState';
import EmptyState from '../components/shared/EmptyState';

export default function RevolvingFund() {
  const { data: fund, isLoading: fundLoading } = useFundMetrics();
  const { data: projects = [], isLoading: projectsLoading } = useProjects();

  if (fundLoading || projectsLoading) {
    return <LoadingState message="Loading fund data..." />;
  }

  if (!fund) {
    return (
      <EmptyState
        icon={<RefreshCcw size={48} strokeWidth={1.5} />}
        title="Fund data unavailable"
        description="Revolving fund metrics could not be loaded. Check your data source configuration."
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div
        className="rounded-xl px-6 py-5"
        style={{ background: 'var(--gradient-earth)', color: '#FFFFFF' }}
      >
        <h2 className="text-xl font-bold mb-1" style={{ fontFamily: 'var(--font-heading)', color: 'rgba(255, 255, 255, 0.85)' }}>
          Revolving Fund Tracker
        </h2>
        <p className="text-sm opacity-80">
          Track the lifecycle of grant capital from deployment through credit issuance and fund recovery.
          The revolving fund model enables ZFP to redeploy recovered capital into new grants.
        </p>
      </div>

      {/* Key metrics */}
      <FundMetrics fund={fund} />

      {/* Flow diagram */}
      <FlowDiagram fund={fund} />

      {/* Two-column layout: stages + source breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProjectStageTracker fund={fund} />
        <FundSourceBreakdown projects={projects} />
      </div>

      {/* Methodology note */}
      <div
        className="rounded-xl px-5 py-4 text-xs"
        style={{
          backgroundColor: 'var(--zfp-cream-dark)',
          color: 'var(--zfp-text-muted)',
          border: '1px solid var(--zfp-border)',
        }}
      >
        <strong style={{ color: 'var(--zfp-text)' }}>About the Revolving Fund:</strong>{' '}
        ZFP's intervention-based model deploys grants to farmers for regenerative practice adoption.
        As practices generate verified outcomes, carbon credits are issued on the Regen Ledger.
        Revenue from credit sales flows back into the redeployment pool, creating a self-sustaining
        funding cycle. Recovery rates vary by practice type, geography, and market conditions.
      </div>
    </div>
  );
}
