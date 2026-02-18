import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import type { FarmProject } from '../types/project';
import type { ProjectFilterState } from '../components/projects/ProjectFilters';
import { DEFAULT_FILTERS } from '../components/projects/ProjectFilters';

async function loadProjects(): Promise<FarmProject[]> {
  const { default: projects } = await import('../data/demo-projects.json');
  return projects as FarmProject[];
}

export function useProjects() {
  return useQuery<FarmProject[]>({
    queryKey: ['projects'],
    queryFn: loadProjects,
  });
}

export function useProject(id: string) {
  const { data: projects, ...rest } = useProjects();
  const project = useMemo(
    () => projects?.find((p) => p.id === id) ?? null,
    [projects, id]
  );
  return { data: project, ...rest };
}

export function useFilteredProjects() {
  const { data: projects = [], ...queryState } = useProjects();
  const [filters, setFilters] = useState<ProjectFilterState>(DEFAULT_FILTERS);

  const filtered = useMemo(() => {
    return projects.filter((project) => {
      // Search
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const match =
          project.farmName.toLowerCase().includes(q) ||
          project.location.county.toLowerCase().includes(q) ||
          project.location.state.toLowerCase().includes(q) ||
          (project.farmerName?.toLowerCase().includes(q) ?? false);
        if (!match) return false;
      }

      // State
      if (filters.states.length > 0 && !filters.states.includes(project.location.state)) {
        return false;
      }

      // Practices
      if (filters.practices.length > 0 && !filters.practices.some((p) => project.practices.includes(p))) {
        return false;
      }

      // Availability
      if (filters.availability.length > 0 && !filters.availability.includes(project.availability)) {
        return false;
      }

      // Fund source
      if (filters.fundSources.length > 0 && !filters.fundSources.includes(project.fundSource)) {
        return false;
      }

      return true;
    });
  }, [projects, filters]);

  return {
    projects: filtered,
    allProjects: projects,
    filters,
    setFilters,
    ...queryState,
  };
}
