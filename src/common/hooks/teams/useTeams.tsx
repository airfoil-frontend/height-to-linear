import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';

import { linearClient } from '@/common/libs/linear';
import { linearAtom } from '@/common/stores/linear.atom';

export const useTeams = () => {
  const { apiKey, isConnected } = useAtomValue(linearAtom);
  const { data, ...rest } = useQuery({
    queryKey: ['teams', apiKey],
    queryFn: async () => {
      const response = await linearClient(apiKey).teams();
      return response;
    },
    enabled: isConnected && !!apiKey,
  });

  return { teams: data?.nodes ?? [], ...data, ...rest };
};
