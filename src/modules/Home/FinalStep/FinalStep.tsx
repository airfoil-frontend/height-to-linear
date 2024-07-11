import { useAtomValue, useSetAtom } from 'jotai';
import { useState } from 'react';

import { Button } from '@/common/components/ui/button';
import { ISSUE_PRIORITY } from '@/common/constants/linear';
import { useCreateIssue } from '@/common/hooks/issues/useCreateIssue';
import { useDeleteIssue } from '@/common/hooks/issues/useDeleteIssue';
import { useUsers } from '@/common/hooks/users/useUsers';
import { appAtom } from '@/common/stores/app.atom';
import { heightAtom } from '@/common/stores/height.atom';
import { linearAtom } from '@/common/stores/linear.atom';

export const FinalStep = () => {
  const setApp = useSetAtom(appAtom);
  const linear = useAtomValue(linearAtom);
  const height = useAtomValue(heightAtom);

  const [totalIssueCreated, setTotalIssueCreated] = useState(0);
  const [createdIssues, setCreatedIssues] = useState<string[]>([]);
  const [createLoading, setCreateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>();

  const { users, isLoading: usersLoading } = useUsers();
  const createIssue = useCreateIssue();
  const deleteIssue = useDeleteIssue();

  const handleGoBack = () => {
    setApp((prev) => ({ ...prev, formStatus: 'priority-form' }));
  };

  const handleSubmit = async () => {
    setCreateLoading(true);
    setError(undefined);
    const issuesCreated = [];
    try {
      for (let i = 0; i < height.data.length; i++) {
        const issue = height.data[i];
        const priority = linear.priorityMap.find(
          (p) => p.height === issue.priority,
        )?.linear;
        const status = linear.statusMap.find(
          (s) => s.height === issue.status,
        )?.linear;
        const assignee = users.find((user) => user.name === issue.assignees[0]);

        const response = await createIssue.mutateAsync({
          title: issue.tasks,
          description: issue.description,
          estimate: Number(issue.estimate?.toFixed(0)),
          teamId: linear.teamId,
          projectId: linear.projectId,
          priority: Number(priority),
          stateId: status?.id,
          createdAt: new Date(issue.createdAt),
          assigneeId: assignee?.id,
        });

        const issueCreated = await response.issue;
        issuesCreated.push(issueCreated.id);
        setTotalIssueCreated((prev) => prev + 1);
      }
      setCreatedIssues(issuesCreated);
      setCreateLoading(false);
    } catch (error) {
      setError(error);
      setCreateLoading(false);
      setDeleteLoading(true);

      // If there are any issues created, delete them
      if (createdIssues.length > 0) {
        for (let i = 0; i < createdIssues.length; i++) {
          await deleteIssue.mutateAsync(createdIssues[i]);
        }
      }

      setDeleteLoading(false);
    }
  };

  const renderButtonText = () => {
    if (usersLoading) {
      return 'Fetching data...';
    }

    if (createLoading) {
      return 'Creating issues...';
    }

    if (deleteLoading) {
      return 'Deleting issues...';
    }

    return 'Export';
  };

  return (
    <div className="flex w-full flex-col gap-6 lg:w-1/3">
      {/* Summary */}
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">Summary</h2>
        <p className="text-gray-400">
          Please review the following information before importing the data.
        </p>
      </div>
      <div className="flex flex-wrap items-start gap-6 sm:gap-2">
        {/* Team */}
        <div className="flex flex-1 flex-col gap-2">
          <h3 className="font-medium">Team</h3>
          <p className="whitespace-nowrap text-gray-400">{linear.team?.name}</p>
        </div>
        {/* Project */}
        <div className="flex flex-1 flex-col gap-2">
          <h3 className="font-medium">Project</h3>
          <p className="whitespace-nowrap text-gray-400">
            {linear.project?.name}
          </p>
        </div>
      </div>
      {/* Status mapping */}
      <div className="flex flex-col gap-2">
        <h3 className="font-medium">Status mapping</h3>
        <ul className="flex flex-col gap-1">
          {linear.statusMap?.map((status) => (
            <li
              key={status.height}
              className="flex items-center gap-1 border-b border-gray-500/30 pb-2 text-gray-400 last:border-b-0 last:pb-0"
            >
              <p className="flex-1">{status.height}</p>
              <p className="flex-1">{status.linear?.name}</p>
            </li>
          ))}
        </ul>
      </div>
      {/* Priority mapping */}
      <div className="flex flex-col gap-2">
        <h3 className="font-medium">Priority mapping</h3>
        <ul className="flex flex-col gap-1">
          {linear.priorityMap?.map((priority) => (
            <li
              key={priority.height}
              className="flex items-center gap-1 border-b border-gray-500/30 pb-2 text-gray-400 last:border-b-0 last:pb-0"
            >
              <p className="flex-1">{priority.height}</p>
              <p className="flex-1">
                {ISSUE_PRIORITY.find((p, index) => index === priority.linear)}
              </p>
            </li>
          ))}
        </ul>
      </div>
      {/* Data information */}
      <div className="flex flex-col gap-6 rounded-md border border-gray-500/30 p-6">
        <div className="flex flex-wrap items-start gap-6 sm:gap-2">
          {/* Total issues */}
          <div className="flex flex-1 flex-col gap-2">
            <h3 className="font-medium">Total issues</h3>
            <p className="text-gray-400">{height.data.length}</p>
          </div>
          {/* Total issues created */}
          <div className="flex flex-1 flex-col gap-2">
            <h3 className="font-medium">Total issues created</h3>
            <p className="text-gray-400">{totalIssueCreated}</p>
          </div>
        </div>
        {/* Error */}
        {error && (
          <div className="flex flex-1 flex-col gap-2">
            <h3 className="font-medium text-red-500">Error</h3>
            <p className="text-red-300">{error.message}</p>
          </div>
        )}
      </div>
      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button
          disabled={createLoading || deleteLoading}
          variant="secondary"
          onClick={handleGoBack}
        >
          Go back
        </Button>
        <Button
          disabled={createLoading || deleteLoading || usersLoading}
          loading={createLoading || deleteLoading || usersLoading}
          onClick={handleSubmit}
        >
          {renderButtonText()}
        </Button>
      </div>
    </div>
  );
};
