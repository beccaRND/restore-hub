import type { ProjectStage } from './project';

export interface RevolvingFundState {
  totalGrantsDeployed: number;
  totalPotentiallyRecoverable: number;
  creditsIssuedValue: number;
  redeploymentPool: number;
  pipeline: {
    projectsWithInterest: number;
    estimatedValue: number;
  };
  projectStages: Record<ProjectStage, number>;
}
