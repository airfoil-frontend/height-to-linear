import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';

import { linearClient } from '@/common/libs/linear';
import { linearAtom } from '@/common/stores/linear.atom';

export const useUsers = () => {
  const { apiKey, isConnected } = useAtomValue(linearAtom);
  const { data, ...rest } = useQuery({
    queryKey: ['users', apiKey],
    queryFn: () => {
      const response = linearClient(apiKey).users();
      return response;
    },
    enabled: !!apiKey && isConnected,
  });

  return { users: data?.nodes ?? [], ...data, ...rest };
};
