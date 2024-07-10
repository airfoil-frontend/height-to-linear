import Image from 'next/image';
import { ComponentPropsWithoutRef } from 'react';

import { cn } from '@/common/utils';

export interface LogoProps extends ComponentPropsWithoutRef<'div'> {}

export const Logo = ({ className, ...props }: LogoProps) => {
  return (
    <div {...props} className={cn('flex items-center gap-4', className)}>
      <Image
        priority
        alt="height-icon"
        className="rounded-md shadow-md"
        height={32}
        src="/height-icon.png"
        width={32}
      />
      <p className="font-medium">to</p>
      <Image
        priority
        alt="linear-icon"
        className="rounded-md shadow-md"
        height={32}
        src="/linear-icon.png"
        width={32}
      />
    </div>
  );
};
