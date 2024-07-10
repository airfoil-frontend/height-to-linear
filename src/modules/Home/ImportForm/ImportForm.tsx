'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom, useSetAtom } from 'jotai';
import { BaseSyntheticEvent } from 'react';
import { Form, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/common/components/ui/button';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/common/components/ui/form';
import { Input } from '@/common/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/common/components/ui/select';
import { useProjects } from '@/common/hooks/projects/useProjects';
import { useTeams } from '@/common/hooks/teams/useTeams';
import { parseCsv } from '@/common/libs/papaparse';
import { appAtom } from '@/common/stores/app.atom';
import { heightAtom } from '@/common/stores/height.atom';
import { linearAtom } from '@/common/stores/linear.atom';
import {
  getPriorityArray,
  getStatusArray,
  transformCsvData,
} from '@/common/utils/transformData';
import { CsvSchema } from '@/common/validation/csvSchema';

const ImportFormSchema = z.object({
  team: z.string({ message: 'Team is required' }),
  project: z.string({ message: 'Project is required' }),
  heightCsv: CsvSchema,
});

export function ImportForm() {
  const { teams, isLoading: teamsLoading } = useTeams();
  const { projects, isLoading: projectsLoading } = useProjects();

  const setApp = useSetAtom(appAtom);
  const setHeight = useSetAtom(heightAtom);
  const [linear, setLinear] = useAtom(linearAtom);

  const form = useForm<z.infer<typeof ImportFormSchema>>({
    resolver: zodResolver(ImportFormSchema),
    defaultValues: {
      team: linear?.teamId ?? '',
      project: linear.projectId ?? '',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      form.setValue('heightCsv', e.target.files[0]);
      form.trigger('heightCsv');
    }
  };

  const onSubmit = (
    data: z.infer<typeof ImportFormSchema>,
    e: BaseSyntheticEvent,
  ) => {
    e.preventDefault();
    setLinear((prev) => ({
      ...prev,
      teamId: data.team,
      team: teams.find((team) => team.id === data.team),
      projectId: data.project,
      project: projects.find((project) => project.id === data.project),
    }));

    const reader = new FileReader();
    reader.onload = async (r) => {
      const csv = r.target?.result as string;
      const parsed = await parseCsv(csv);
      const transformed = transformCsvData(parsed.data);
      const statuses = getStatusArray(transformed);
      const priorities = getPriorityArray(transformed);

      setHeight((prev) => ({
        ...prev,
        data: transformed,
        statuses,
        priorities,
      }));
    };
    reader.readAsText(data.heightCsv);

    setApp((prev) => ({ ...prev, formStatus: 'status-form' }));
  };

  return (
    <Form {...form}>
      <form
        className="w-full space-y-6 lg:w-1/3"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="team"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team</FormLabel>
              <Select
                defaultValue={field.value}
                disabled={teamsLoading}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        teamsLoading ? 'Fetching data...' : 'Select a team'
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {teams
                    .sort((a, b) => a.name.localeCompare(b.name)) // Sort teams by name ascending
                    .map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="project"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project</FormLabel>
              <Select
                defaultValue={field.value}
                disabled={projectsLoading}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        projectsLoading
                          ? 'Fetching data...'
                          : 'Select a project'
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {projects
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="heightCsv"
          render={() => (
            <FormItem>
              <FormLabel>Height CSV</FormLabel>
              <FormControl>
                <Input
                  placeholder="Choose a file..."
                  type="file"
                  onChange={handleFileChange}
                />
              </FormControl>
              <FormDescription>
                Export the file from Project Detail Page {'>'} Export {'>'}{' '}
                Tasks as CSV
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={!form.formState.isValid}
          type="submit"
          onClick={form.handleSubmit(onSubmit)}
        >
          Export
        </Button>
      </form>
    </Form>
  );
}
