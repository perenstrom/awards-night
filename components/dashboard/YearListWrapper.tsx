'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';

export default function YearListWrapper({
  children
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();
  const isDashboardRoot = pathName === '/me/bets';

  return (
    <div
      className={clsx(
        'max-h-screen sticky top-0 overflow-y-auto w-full p-2 md:w-75',
        isDashboardRoot ? 'flex flex-col' : 'hidden md:flex md:flex-col'
      )}
    >
      {children}
    </div>
  );
}
