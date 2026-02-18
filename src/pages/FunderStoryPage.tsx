import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { useFunder } from '../hooks/useFunders';
import FunderImpactPage from '../components/stories/FunderImpactPage';
import LoadingState from '../components/shared/LoadingState';
import EmptyState from '../components/shared/EmptyState';

export default function FunderStoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: funder, isLoading } = useFunder(slug || '');

  return (
    <div>
      <Link
        to="/stories"
        className="inline-flex items-center gap-1.5 text-sm font-medium mb-6 transition-colors hover:text-[var(--zfp-green)]"
        style={{ color: 'var(--zfp-text-muted)' }}
      >
        <ArrowLeft size={16} strokeWidth={1.75} />
        Back to Funder Stories
      </Link>

      {isLoading && <LoadingState message="Loading funder story..." />}

      {!isLoading && !funder && (
        <EmptyState
          icon={<BookOpen size={48} strokeWidth={1.5} />}
          title="Funder not found"
          description="This funder story may have been removed or the URL is incorrect."
        />
      )}

      {funder && <FunderImpactPage funder={funder} />}
    </div>
  );
}
