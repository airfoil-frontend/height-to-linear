'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
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
import { ISSUE_PRIORITY } from '@/common/constants/linear';
import { appAtom } from '@/common/stores/app.atom';
import { heightAtom } from '@/common/stores/height.atom';
import { linearAtom } from '@/common/stores/linear.atom';

const PriorityMapFormSchema = z.object({
  priority: z.array(
    z.object({
      height: z.string(),
      linear: z.string(),
    }),
  ),
});

export const PriorityMapForm = () => {
  const height = useAtomValue(heightAtom);
  const [linear, setLinear] = useAtom(linearAtom);
  const setApp = useSetAtom(appAtom);

  const form = useForm<z.infer<typeof PriorityMapFormSchema>>({
    resolver: zodResolver(PriorityMapFormSchema),
  });

  useEffect(() => {
    // If there are already priority mappings, set the form values
    if (linear.priorityMap?.length > 0) {
      const priority = linear.priorityMap.map((priority) => ({
        height: priority.height,
        linear: priority.linear.toString(),
      }));
      form.reset({ priority });
    }
    // If there are no priority mappings, set the form values based on the height priorities
    else if (height.priorities?.length > 0) {
      const priority = height.priorities.map((priority) => {
        const foundPriorityIndex = ISSUE_PRIORITY.findIndex(
          (p) => p === priority,
        );
        return {
          height: priority,
          linear:
            foundPriorityIndex === -1 ? '0' : foundPriorityIndex.toString(),
        };
      });
      form.reset({ priority });
    }
  }, [form, height.priorities, linear.priorityMap]);

  const handleGoBack = () => {
    setApp((prev) => ({ ...prev, formStatus: 'status-form' }));
  };

  const onSubmit = async (data: z.infer<typeof PriorityMapFormSchema>) => {
    setLinear((prev) => ({
      ...prev,
      priorityMap: data.priority.map((p) => ({
        height: p.height,
        linear: Number(p.linear),
      })),
    }));
    setApp((prev) => ({ ...prev, formStatus: 'final-step' }));
  };

  return (
    <div className="flex w-full flex-col gap-6 lg:w-1/3">
      {/* Content */}
      <p className="text-gray-400">
        Please choose the correct issue priority from Height to Linear. Linear
        has constant priorities, so we need to map the height priorities to the
        Linear priorities.
        <ul className="pt-2">
          <li>- No priority</li>
          <li>- Urgent</li>
          <li>- High</li>
          <li>- Normal</li>
          <li>- Low</li>
        </ul>
      </p>
      {/* Form */}
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex items-start justify-between gap-6">
            <FormItem>
              <FormLabel>Height priority</FormLabel>
              <div className="space-y-6">
                {height.priorities.map((priority, index) => (
                  <FormField
                    key={priority}
                    control={form.control}
                    name={`priority.${index}.height`}
                    render={() => (
                      <Input key={priority} readOnly value={priority} />
                    )}
                  />
                ))}
              </div>
            </FormItem>
            <FormItem>
              <FormLabel>Linear priority</FormLabel>
              <div className="space-y-6">
                {height.priorities.map((priority, index) => (
                  <FormField
                    key={priority}
                    control={form.control}
                    name={`priority.${index}.linear`}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ISSUE_PRIORITY.map((priority, index) => (
                            <SelectItem key={priority} value={index.toString()}>
                              {priority}
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
