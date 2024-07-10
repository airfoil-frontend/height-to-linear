import { Height } from '@/common/types/height';

const generatePriority = (priority: string): string => {
  switch (priority) {
    case 'Critical':
      return 'Urgent';
    case 'Backburner':
      return 'Backlog';
    default:
      return priority;
  }
};

const generateStatus = (status: string): string => {
  switch (status) {
    case 'To do':
      return 'Todo';
    case "Won't do":
      return 'Cancelled';
    case 'In progress':
      return 'In Progress';
    default:
      return status;
  }
};

const extractFullNames = (input: string): string[] => {
  const regex = /([^,]+?) \([^\)]+\)/g;
  const matches = [];
  let match;
  while ((match = regex.exec(input)) !== null) {
    matches.push(match[1].trim());
  }
  return matches;
};

export const transformCsvData = (inputArray: any[]): Height[] => {
  return inputArray.map((input) => ({
    index: input['Index'],
    parentTask: input['Parent task'],
    indentation: input['Indentation'],
    tasks: input['Tasks'],
    lists: input['Lists'],
    description: input['Description'],
    status: input['Status'],
    assignees: extractFullNames(input['Assignees']),
    dueDate: input['Due date'],
    startDate: input['Start date'],
    priority: input['Priority'],
    timer: input['Timer'],
    workType: input['Work type/Team'],
    projectLead: input['Project Lead'],
    estimate: input['Estimate'] ? Number(input['Estimate']) : undefined,
    completed: input['Completed'],
    completedAt: input['Completed at'],
    completedBy: extractFullNames(input['Completed by']),
    createdAt: input['Created at'],
    createdBy: extractFullNames(input['Created by']),
  }));
};

export const getStatusArray = (data: Height[]): string[] => {
  const statusSet = new Set<string>();
  data.forEach((item) => {
    if (item.status) {
      statusSet.add(item.status);
    }
  });
  return Array.from(statusSet);
};

export const getPriorityArray = (data: Height[]): string[] => {
  const prioritySet = new Set<string>();
  data.forEach((item) => {
    if (item.priority) {
      prioritySet.add(item.priority);
    }
  });
  return Array.from(prioritySet);
};
