import type { FarmProject } from '../../types/project';
import ProjectCard from './ProjectCard';
import EmptyState from '../shared/EmptyState';
import { Sprout } from 'lucide-react';

interface ProjectGridProps {
  projects: FarmProject[];
}

export default function ProjectGrid({ projects }: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <EmptyState
        icon={<Sprout size={48} strokeWidth={1.5} />}
        title="No projects found"
        description="Try adjusting your filters to see more farm projects."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project, i) => (
        <ProjectCard key={project.id} project={project} index={i} />
      ))}
    </div>
  );
}
