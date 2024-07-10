import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';

import { linearClient } from '@/common/libs/linear';
import { linearAtom } from '@/common/stores/linear.atom';

export const useProjects = () => {
  const { apiKey, isConnected } = useAtomValue(linearAtom);
  const { data, ...rest } = useQuery({
    queryKey: ['projects', apiKey],
    queryFn: async () => {
      const response = await linearClient(apiKey).projects();
      return response;
    },
    enabled: isConnected && !!apiKey,
  });

  return { projects: data?.nodes ?? [], ...data, ...rest };
};
