'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover';
import { Check, ChevronsUpDown, Command } from 'lucide-react';
import React from 'react';

import { Button } from '@/common/components/ui/button';
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/common/components/ui/command';
import { useTeams } from '@/common/hooks/teams/useTeams';
import { cn } from '@/common/utils';

export interface TeamSelectProps {
  onSelect: (value: string) => void;
}

export const TeamSelect = ({ onSelect }: TeamSelectProps) => {
  const { teams } = useTeams();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<string>('');

  const handleSelect = (value: string) => {
    setValue(value);
    onSelect(value);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          aria-expanded={open}
          className="justify-between"
          role="combobox"
          variant="outline"
        >
          {value
            ? teams?.find((team) => team.id === value)?.name
            : 'Select team...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Search team..." />
          <CommandEmpty>No team found.</CommandEmpty>
          <CommandGroup>
            {teams?.map((team) => (
              <CommandItem
                key={team.id}
                value={team.id}
                onSelect={handleSelect}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    value === team.id ? 'opacity-100' : 'opacity-0',
                  )}
                />
                {team.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
