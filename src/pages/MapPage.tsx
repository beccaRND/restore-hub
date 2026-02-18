import { lazy, Suspense } from 'react';
import { useProjects } from '../hooks/useProjects';
import MapStats from '../components/map/MapStats';
import LoadingState from '../components/shared/LoadingState';

const ProjectMap = lazy(() => import('../components/map/ProjectMap'));

export default function MapPage() {
  const { data: projects = [], isLoading } = useProjects();

  if (isLoading) {
    return <LoadingState message="Loading map data..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="rounded-xl px-6 py-5"
        style={{ background: 'var(--gradient-earth)', color: '#FFFFFF' }}
      >
        <h2 className="text-xl font-bold mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
          Project Map
        </h2>
        <p className="text-sm opacity-80">
          Geographic view of all ZFP farm projects. Marker size reflects acreage, color indicates availability status.
          Click any marker for project details.
        </p>
      </div>

      <Suspense fallback={<LoadingState message="Loading map..." />}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          <ProjectMap projects={projects} />
          <MapStats projects={projects} />
        </div>
      </Suspense>
    </div>
  );
}
