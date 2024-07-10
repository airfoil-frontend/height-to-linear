'use client';

import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useMemo } from 'react';

import { appAtom } from '@/common/stores/app.atom';
import { linearAtom } from '@/common/stores/linear.atom';

import { FinalStep } from '@/modules/Home/FinalStep';
import { ImportForm } from '@/modules/Home/ImportForm';
import { PriorityMapForm } from '@/modules/Home/PriorityMapForm';
import { SetupForm } from '@/modules/Home/SetupForm';
import { StatusMapForm } from '@/modules/Home/StatusMapForm';

export const Home = () => {
  const { apiKey } = useAtomValue(linearAtom);
  const [app, setApp] = useAtom(appAtom);

  useEffect(() => {
    if (!apiKey) {
      setApp((prev) => ({ ...prev, formStatus: 'connect-form' }));
    }
  }, [apiKey, setApp]);

  const renderForm = useMemo(() => {
    switch (app.formStatus) {
      case 'connect-form':
        return <SetupForm />;
      case 'import-form':
        return <ImportForm />;
      case 'status-form':
        return <StatusMapForm />;
      case 'priority-form':
        return <PriorityMapForm />;
      case 'final-step':
        return <FinalStep />;
      default:
        return <SetupForm />;
    }
  }, [app.formStatus]);

  return (
    <div className="flex flex-col gap-6">
      {/* Title and description */}
      <div className="space-y-2 border-b border-muted-foreground/20 pb-6">
        <h1 className="text-lg font-medium">Height to Linear</h1>
        <p className="text-gray-400">
          Convert height tickets to linear issues with magic ✨
        </p>
      </div>
      {/* Form */}
      {renderForm}
    </div>
  );
};
