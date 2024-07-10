import { Metadata, Viewport } from 'next';
import { Inter as FontSans } from 'next/font/google';
import type { PropsWithChildren } from 'react';

import { CoreLayout } from '@/common/components/CoreLayout';
import { Favicon } from '@/common/components/FavIcon';
import { Toaster } from '@/common/components/ui/toaster';
import { inter } from '@/common/fonts';
import { cn } from '@/common/utils/classnames';

import { Providers } from '@/app/providers';
import '@/common/styles/globals.scss';
import 'jotai-devtools/styles.css';

export const viewport: Viewport = {
  themeColor: 'black',
};

export const metadata: Metadata = {
  title: 'Height to Linear',
  description: 'Convert height tickets to linear issues with magic ✨',
  metadataBase: new URL('https://google.com'),
  openGraph: {
    title: 'Height to Linear',
    description: 'Convert height tickets to linear issues with magic ✨',
    url: 'https://google.com',
    siteName: 'Height to Linear',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ayungavis',
    creator: '@ayungavis',
  },
};

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

const GlobalLayout = ({ children }: PropsWithChildren) => {
  return (
    <html className={[inter.variable].join(' ')} lang="en">
      <Favicon />
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
        )}
      >
        <Providers>
          <CoreLayout>{children}</CoreLayout>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
};

export default GlobalLayout;
