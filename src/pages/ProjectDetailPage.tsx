import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Sprout } from 'lucide-react';
import { useProject } from '../hooks/useProjects';
import ProjectDetail from '../components/projects/ProjectDetail';
import LoadingState from '../components/shared/LoadingState';
import EmptyState from '../components/shared/EmptyState';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: project, isLoading } = useProject(id || '');

  return (
    <div>
      <Link
        to="/projects"
        className="inline-flex items-center gap-1.5 text-sm font-medium mb-6 transition-colors hover:text-[var(--zfp-green)]"
        style={{ color: 'var(--zfp-text-muted)' }}
      >
        <ArrowLeft size={16} strokeWidth={1.75} />
        Back to Projects
      </Link>

      {isLoading && <LoadingState message="Loading project..." />}

      {!isLoading && !project && (
        <EmptyState
          icon={<Sprout size={48} strokeWidth={1.5} />}
          title="Project not found"
          description="This project may have been removed or the ID is incorrect."
        />
      )}

      {project && <ProjectDetail project={project} />}
    </div>
  );
}
