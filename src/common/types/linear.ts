import { Project, Team, User, WorkflowState } from '@linear/sdk';

type StatusMap = {
  height?: string;
  linear?: WorkflowState;
};

type PriorityMap = {
  height?: string;
  linear?: number;
};

export type LinearState = {
  apiKey: string;
  user?: User;
  isConnected: boolean;
  teamId?: string;
  team?: Team;
  projectId?: string;
  project?: Project;
  statusMap?: StatusMap[];
  priorityMap?: PriorityMap[];
};

export type CreateLinearIssuePayload = {
  assigneeId?: string;
  createAsUser?: string;
  createdAt?: Date;
  description?: string;
  estimate?: number;
  priority?: number;
  projectId: string;
  stateId?: string;
  teamId: string;
  title: string;
};
