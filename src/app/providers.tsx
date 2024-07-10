'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as JotaiProvider } from 'jotai';
import { DevTools } from 'jotai-devtools';
import { ReactNode } from 'react';

import { ThemeProvider } from '@/common/providers/ThemeProvider';
import { store } from '@/common/stores';

const queryClient = new QueryClient();

export interface ProviderProps {
  children?: ReactNode;
}

export const Providers = ({ children }: ProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <JotaiProvider store={store}>
        <ThemeProvider
          disableTransitionOnChange
          enableSystem
          attribute="class"
          defaultTheme="system"
        >
          {children}
        </ThemeProvider>
        <DevTools store={store} />
      </JotaiProvider>
    </QueryClientProvider>
  );
};
