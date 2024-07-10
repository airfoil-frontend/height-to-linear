'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useSetAtom } from 'jotai';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/common/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/common/components/ui/form';
import { Input } from '@/common/components/ui/input';
import { useGetCurrentUser } from '@/common/hooks/users/useGetCurrentUser';
import { appAtom } from '@/common/stores/app.atom';
import { linearAtom } from '@/common/stores/linear.atom';

const SetupFormSchema = z.object({
  apiKey: z.string({ message: 'API key is required' }),
});

export const SetupForm = () => {
  const setLinear = useSetAtom(linearAtom);
  const setApp = useSetAtom(appAtom);
  const getCurrentUser = useGetCurrentUser();

  const form = useForm<z.infer<typeof SetupFormSchema>>({
    resolver: zodResolver(SetupFormSchema),
    defaultValues: {
      apiKey: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof SetupFormSchema>) => {
    setLinear((prev) => ({ ...prev, apiKey: data.apiKey }));
    await getCurrentUser.mutateAsync().then(() => {
      setApp((prev) => ({ ...prev, formStatus: 'import-form' }));
    });
  };

  return (
    <Form {...form}>
      <form
        className="w-full space-y-6 lg:w-1/3"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="apiKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Linear API Key</FormLabel>
              <FormControl>
                <Input placeholder="Put your API key here..." {...field} />
              </FormControl>
              <FormDescription>
                You can find your API key in{' '}
                <a
                  className="underline"
                  href="https://linear.app/settings/api"
                  rel="noreferrer"
                  target="_blank"
                >
                  Linear settings
                </a>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={!form.formState.isValid || getCurrentUser.isPending}
          loading={getCurrentUser.isPending}
          type="submit"
          onClick={form.handleSubmit(onSubmit)}
        >
          {getCurrentUser.isPending ? 'Connecting...' : 'Connect'}
        </Button>
      </form>
    </Form>
  );
};
