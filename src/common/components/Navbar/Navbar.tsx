import Link from 'next/link';
import { ComponentPropsWithoutRef } from 'react';

import { Logo } from '@/common/components/Logo';
import { ThemeToggle } from '@/common/components/ThemeToggle';
import { cn } from '@/common/utils';

export interface NavbarProps extends ComponentPropsWithoutRef<'nav'> {}

export const Navbar = ({ className, ...props }: NavbarProps) => {
  return (
    <nav
      {...props}
      className={cn(
        'container mx-auto flex items-center justify-between py-5',
        className,
      )}
    >
      {/* Logo */}
      <Link href="/">
        <Logo />
      </Link>
      {/* Right side */}
      <div>
        <ThemeToggle />
      </div>
    </nav>
  );
};
