import { useRegenLedger } from '../hooks/useRegenLedger';
import { Database } from 'lucide-react';
import NetworkStatus from '../components/ledger/NetworkStatus';
import CreditClassExplorer from '../components/ledger/CreditClassExplorer';
import RecentBatches from '../components/ledger/RecentBatches';
import CreditTypeChart from '../components/ledger/CreditTypeChart';
import LoadingState from '../components/shared/LoadingState';
import EmptyState from '../components/shared/EmptyState';

export default function RegenLedgerPage() {
  const { data: ledger, isLoading, status } = useRegenLedger();

  if (isLoading) {
    return <LoadingState message="Connecting to Regen Ledger..." />;
  }

  if (!ledger) {
    return (
      <EmptyState
        icon={<Database size={48} strokeWidth={1.5} />}
        title="Ledger unavailable"
        description="Could not connect to the Regen Ledger. Check your network connection or MCP configuration."
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div
        className="rounded-xl px-6 py-5"
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          color: '#FFFFFF',
        }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'rgba(82, 183, 136, 0.2)' }}
          >
            <Database size={16} strokeWidth={1.75} style={{ color: '#52B788' }} />
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
              Regen Ledger
            </h2>
            <p className="text-xs opacity-70">On-chain ecological data infrastructure</p>
          </div>
        </div>
        <p className="text-sm opacity-80">
          Explore credit classes, projects, and credit batches registered on the Regen Ledger.
          All data is publicly verifiable and anchored on-chain with content-addressable IRIs.
        </p>
      </div>

      {/* Network status */}
      <NetworkStatus stats={ledger.networkStats} status={status} />

      {/* Two-column: credit type chart + recent batches */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CreditTypeChart classes={ledger.creditClasses} creditTypes={ledger.creditTypes} />
        <RecentBatches batches={ledger.recentBatches} />
      </div>

      {/* Credit class explorer */}
      <CreditClassExplorer classes={ledger.creditClasses} creditTypes={ledger.creditTypes} />

      {/* Integration note */}
      <div
        className="rounded-xl px-5 py-4 text-xs"
        style={{
          backgroundColor: 'var(--zfp-cream-dark)',
          color: 'var(--zfp-text-muted)',
          border: '1px solid var(--zfp-border)',
        }}
      >
        <strong style={{ color: 'var(--zfp-text)' }}>About the Regen Ledger:</strong>{' '}
        Regen Ledger is a Cosmos SDK-based blockchain purpose-built for ecological assets.
        Credit classes define methodologies, projects represent real-world activities, and
        credit batches are the tradeable units issued after verification. All metadata is
        anchored via content-addressable IRIs, ensuring data integrity and provenance.
        ZFP projects with verified outcomes can have their credits issued directly on the ledger.
      </div>
    </div>
  );
}
