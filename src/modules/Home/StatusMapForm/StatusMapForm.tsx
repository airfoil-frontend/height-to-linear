'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/common/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/common/components/ui/form';
import { Input } from '@/common/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/common/components/ui/select';
import { useWorkflowStates } from '@/common/hooks/issues/useWorkflowStates';
import { appAtom } from '@/common/stores/app.atom';
import { heightAtom } from '@/common/stores/height.atom';
import { linearAtom } from '@/common/stores/linear.atom';

const StatusMapFormSchema = z.object({
  status: z.array(
    z.object({
      height: z.string(),
      linear: z.string(),
    }),
  ),
});

export const StatusMapForm = () => {
  const height = useAtomValue(heightAtom);
  const [linear, setLinear] = useAtom(linearAtom);
  const setApp = useSetAtom(appAtom);

  const { workflowStates, isLoading: workflowStatesLoading } =
    useWorkflowStates({
      filter: { team: { id: { eq: linear?.teamId } } },
    });

  const form = useForm<z.infer<typeof StatusMapFormSchema>>({
    resolver: zodResolver(StatusMapFormSchema),
  });

  const findStatus = useCallback(
    (status: string) => {
      return workflowStates.find((state) => state.name === status)?.id;
    },
    [workflowStates],
  );

  useEffect(() => {
    // If there is already a status map, reset the form with the existing data
    if (linear.statusMap?.length > 0) {
      const status = linear.statusMap.map((status) => ({
        height: status.height,
        linear: status.linear.id,
      }));
      form.reset({ status });
    }
    // If there is no status map, but there are statuses in Height and Linear, reset the form with the statuses
    else if (workflowStates?.length > 0 && height.statuses?.length > 0) {
      const status = height.statuses.map((status) => ({
        height: status,
        linear: findStatus(status),
      }));
      form.reset({ status });
    }
  }, [
    findStatus,
    form,
    height.statuses,
    linear.statusMap,
    workflowStates.length,
  ]);

  const handleGoBack = () => {
    setApp((prev) => ({ ...prev, formStatus: 'import-form' }));
  };

  const onSubmit = async (data: z.infer<typeof StatusMapFormSchema>) => {
    const statusMap = data.status.map((status) => ({
      height: status.height,
      linear: workflowStates.find((state) => state.id === status.linear),
    }));
    setLinear((prev) => ({ ...prev, statusMap }));
    setApp((prev) => ({ ...prev, formStatus: 'priority-form' }));
  };

  return (
    <div className="flex w-full flex-col gap-6 lg:w-1/3">
      {/* Content */}
      <p className="text-gray-400">
        Please choose the correct issue status from Height to Linear. We need to
        mapping the status because some status in Height might not exist in
        Linear.
      </p>
      {/* Form */}
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex items-start justify-between gap-6">
            <FormItem>
              <FormLabel>Height status</FormLabel>
              <div className="space-y-6">
                {height.statuses.map((status, index) => (
                  <FormField
                    key={status}
                    control={form.control}
                    name={`status.${index}.height`}
                    render={() => (
                      <Input key={status} readOnly value={status} />
                    )}
                  />
                ))}
              </div>
            </FormItem>
            <FormItem>
              <FormLabel>Linear status</FormLabel>
              <div className="space-y-6">
                {height.statuses.map((status, index) => (
                  <FormField
                    key={status}
                    control={form.control}
                    name={`status.${index}.linear`}
                    render={({ field }) => (
                      <Select
                        disabled={workflowStatesLoading}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                workflowStatesLoading
                                  ? 'Fetching data...'
                                  : 'Select a status'
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {workflowStates
                            .sort((a, b) => b.position - a.position) // Sort states by position descending
                            .map((workflow) => (
                              <SelectItem key={workflow.id} value={workflow.id}>
                                {workflow.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                ))}
              </div>
            </FormItem>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="secondary" onClick={handleGoBack}>
              Go back
            </Button>
            <Button
              disabled={!form.formState.isValid}
              type="submit"
              onClick={form.handleSubmit(onSubmit)}
            >
              Next
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
