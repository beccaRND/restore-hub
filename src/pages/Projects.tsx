import { useState, lazy, Suspense } from 'react';
import { useFilteredProjects } from '../hooks/useProjects';
import ProjectGrid from '../components/projects/ProjectGrid';
import ProjectFilters from '../components/projects/ProjectFilters';
import MapStats from '../components/map/MapStats';
import LoadingState from '../components/shared/LoadingState';
import { LayoutGrid, Map as MapIcon } from 'lucide-react';

// Lazy-load the map to avoid loading Leaflet CSS/JS unless needed
const ProjectMap = lazy(() => import('../components/map/ProjectMap'));

type ViewMode = 'grid' | 'map';

export default function Projects() {
  const { projects, allProjects, filters, setFilters, isLoading } = useFilteredProjects();
  const [view, setView] = useState<ViewMode>('grid');

  if (isLoading) {
    return <LoadingState message="Loading farm projects..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <ProjectFilters
            filters={filters}
            onChange={setFilters}
            totalCount={allProjects.length}
            filteredCount={projects.length}
          />
        </div>

        {/* View toggle */}
        <div
          className="flex items-center rounded-lg border overflow-hidden flex-shrink-0"
          style={{ borderColor: 'var(--zfp-border)' }}
        >
          <button
            onClick={() => setView('grid')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors"
            style={{
              backgroundColor: view === 'grid' ? 'var(--zfp-green)' : 'var(--zfp-white)',
              color: view === 'grid' ? '#FFFFFF' : 'var(--zfp-text-muted)',
            }}
          >
            <LayoutGrid size={14} strokeWidth={1.75} />
            Grid
          </button>
          <button
            onClick={() => setView('map')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors"
            style={{
              backgroundColor: view === 'map' ? 'var(--zfp-green)' : 'var(--zfp-white)',
              color: view === 'map' ? '#FFFFFF' : 'var(--zfp-text-muted)',
            }}
          >
            <MapIcon size={14} strokeWidth={1.75} />
            Map
          </button>
        </div>
      </div>

      {view === 'grid' && <ProjectGrid projects={projects} />}

      {view === 'map' && (
        <Suspense fallback={<LoadingState message="Loading map..." />}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
            <ProjectMap projects={projects} />
            <MapStats projects={projects} />
          </div>
        </Suspense>
      )}
    </div>
  );
}
