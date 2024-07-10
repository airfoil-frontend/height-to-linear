import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';

import { linearClient } from '@/common/libs/linear';
import { linearAtom } from '@/common/stores/linear.atom';

export const useIssueLabels = () => {
  const { apiKey, isConnected } = useAtomValue(linearAtom);
  const { data, ...rest } = useQuery({
    queryKey: ['issueLabels', apiKey],
    queryFn: () => {
      const response = linearClient(apiKey).issueLabels();
      return response;
    },
    enabled: !!apiKey && isConnected,
  });

  return { issueLabels: data?.nodes ?? [], ...data, ...rest };
};
