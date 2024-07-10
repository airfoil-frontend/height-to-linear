import { WorkflowStatesQueryVariables } from '@linear/sdk/dist/_generated_documents';
import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';

import { linearClient } from '@/common/libs/linear';
import { linearAtom } from '@/common/stores/linear.atom';

export const useWorkflowStates = (variables?: WorkflowStatesQueryVariables) => {
  const { apiKey, isConnected } = useAtomValue(linearAtom);
  const { data, ...rest } = useQuery({
    queryKey: ['workflowStates', apiKey],
    queryFn: () => {
      const response = linearClient(apiKey).workflowStates(variables);
      return response;
    },
    enabled: isConnected && !!apiKey,
  });

  return { workflowStates: data?.nodes ?? [], ...data, ...rest };
};
