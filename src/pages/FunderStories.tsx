import { useFunders } from '../hooks/useFunders';
import FunderCard from '../components/stories/FunderCard';
import LoadingState from '../components/shared/LoadingState';
import EmptyState from '../components/shared/EmptyState';
import { BookOpen } from 'lucide-react';
import { formatCurrency, formatNumber } from '../lib/formatters';

export default function FunderStories() {
  const { data: funders = [], isLoading } = useFunders();

  if (isLoading) {
    return <LoadingState message="Loading funder stories..." />;
  }

  if (funders.length === 0) {
    return (
      <EmptyState
        icon={<BookOpen size={48} strokeWidth={1.5} />}
        title="No funder stories yet"
        description="Funder impact stories will appear here as corporate partnerships are established."
      />
    );
  }

  // Aggregate stats
  const totalContributed = funders.reduce((sum, f) => sum + f.contributionTotal, 0);
  const totalProjects = funders.reduce((sum, f) => sum + f.projectsSupported, 0);
  const totalAcres = funders.reduce((sum, f) => sum + f.acresImpacted, 0);

  return (
    <div className="space-y-6">
      {/* Summary banner */}
      <div
        className="rounded-xl px-6 py-5 flex flex-wrap items-center gap-x-10 gap-y-3"
        style={{
          background: 'var(--gradient-earth)',
          color: '#FFFFFF',
        }}
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-1">Corporate Partners</p>
          <p className="text-3xl font-bold" style={{ fontFamily: 'var(--font-mono)' }}>
            {funders.length}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-1">Total Contributed</p>
          <p className="text-3xl font-bold" style={{ fontFamily: 'var(--font-mono)' }}>
            {formatCurrency(totalContributed)}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-1">Projects Supported</p>
          <p className="text-3xl font-bold" style={{ fontFamily: 'var(--font-mono)' }}>
            {formatNumber(totalProjects)}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-1">Acres Impacted</p>
          <p className="text-3xl font-bold" style={{ fontFamily: 'var(--font-mono)' }}>
            {formatNumber(totalAcres)}
          </p>
        </div>
      </div>

      {/* Info note */}
      <p className="text-sm" style={{ color: 'var(--zfp-text-muted)' }}>
        Each story page is shareable — companies can link from their sustainability pages. Click any partner to view their full impact narrative.
      </p>

      {/* Funder cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {funders.map((funder, i) => (
          <FunderCard key={funder.id} funder={funder} index={i} />
        ))}
      </div>
    </div>
  );
}
