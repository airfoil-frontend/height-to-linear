import { IssueCreateInput } from '@linear/sdk/dist/_generated_documents';
import { useMutation } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';

import { toast } from '@/common/components/ui/use-toast';
import { linearClient } from '@/common/libs/linear';
import { linearAtom } from '@/common/stores/linear.atom';

export const useCreateIssue = () => {
  const { apiKey } = useAtomValue(linearAtom);
  const mutation = useMutation({
    mutationFn: async (payload: IssueCreateInput) => {
      const response = await linearClient(apiKey).createIssue(payload);
      return response;
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: 'Failed to create issue',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return mutation;
};
