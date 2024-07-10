import { useMutation } from '@tanstack/react-query';
import { useAtom } from 'jotai';

import { toast } from '@/common/components/ui/use-toast';
import { linearClient } from '@/common/libs/linear';
import { linearAtom } from '@/common/stores/linear.atom';

export const useGetCurrentUser = () => {
  const [linear, setLinear] = useAtom(linearAtom);
  const mutation = useMutation({
    mutationFn: async () => {
      const response = await linearClient(linear.apiKey).viewer;
      return response;
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: 'Failed to get user information',
        description: error.message,
        variant: 'destructive',
      });
    },
    onSuccess: (data) => {
      toast({
        description: `Welcome back, ${data.name}!`,
      });
      setLinear((prev) => ({ ...prev, user: data, isConnected: true }));
    },
  });

  return mutation;
};
