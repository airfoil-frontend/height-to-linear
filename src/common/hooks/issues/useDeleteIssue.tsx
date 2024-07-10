import { useMutation } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';

import { toast } from '@/common/components/ui/use-toast';
import { linearClient } from '@/common/libs/linear';
import { linearAtom } from '@/common/stores/linear.atom';

export const useDeleteIssue = () => {
  const { apiKey } = useAtomValue(linearAtom);
  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await linearClient(apiKey).deleteIssue(id, {
        permanentlyDelete: true,
      });
      return response;
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: 'Failed to delete issue',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return mutation;
};
