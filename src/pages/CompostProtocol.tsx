import { useProjects } from '../hooks/useProjects';
import CreditCalculator from '../components/compost/CreditCalculator';
import Forecasting from '../components/compost/Forecasting';
import JurisdictionView from '../components/compost/JurisdictionView';
import ScenarioBuilder from '../components/compost/ScenarioBuilder';
import ProtocolDocs from '../components/compost/ProtocolDocs';
import CompostProjects from '../components/compost/CompostProjects';
import LoadingState from '../components/shared/LoadingState';

export default function CompostProtocol() {
  const { data: projects = [], isLoading } = useProjects();

  if (isLoading) {
    return <LoadingState message="Loading compost data..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div
        className="rounded-xl px-6 py-5"
        style={{ background: 'var(--gradient-earth)', color: '#FFFFFF' }}
      >
        <h2 className="text-xl font-bold mb-1" style={{ fontFamily: 'var(--font-heading)', color: 'rgba(255, 255, 255, 0.85)' }}>
          Compost Protocol Explorer
        </h2>
        <p className="text-sm opacity-80">
          Model compost-as-financial-product pathways. Calculate carbon credit potential,
          compare scenarios, and explore the protocol from sourcing to credit issuance.
        </p>
      </div>

      {/* Calculator */}
      <CreditCalculator />

      {/* Forecasting */}
      <Forecasting />

      {/* Jurisdiction comparison */}
      <JurisdictionView />

      {/* Two-column: scenario builder + projects list */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ScenarioBuilder />
        <CompostProjects projects={projects} />
      </div>

      {/* Protocol documentation */}
      <ProtocolDocs />

      {/* Methodology note */}
      <div
        className="rounded-xl px-5 py-4 text-xs"
        style={{
          backgroundColor: 'var(--zfp-cream-dark)',
          color: 'var(--zfp-text-muted)',
          border: '1px solid var(--zfp-border)',
        }}
      >
        <strong style={{ color: 'var(--zfp-text)' }}>About Compost Credits:</strong>{' '}
        Compost application sequesters carbon by adding stable organic matter to soil. The residual
        carbon fraction (typically 25–45%) represents the portion that remains sequestered over a
        multi-year crediting period. Actual sequestration depends on soil type, climate, compost
        quality, and management practices. All estimates use a CO2e conversion factor of 3.67
        (molecular weight ratio of CO2 to C). Credits are issued on the Regen Ledger after
        third-party verification.
      </div>
    </div>
  );
}
