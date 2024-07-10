export type HeightState = {
  data: Height[];
  priorities: string[];
  statuses: string[];
};

export type Height = {
  index: string;
  parentTask?: string;
  indentation?: string;
  tasks: string;
  lists: string;
  description?: string;
  status: string;
  assignees?: string[];
  dueDate?: string;
  startDate?: string;
  priority?: string;
  timer?: string;
  workType?: string;
  projectLead?: string;
  estimate?: number;
  completed?: string;
  completedAt?: string;
  completedBy?: string[];
  createdAt?: string;
  createdBy?: string[];
};
