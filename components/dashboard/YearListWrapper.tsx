'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import styles from './YearListWrapper.module.scss';

export default function YearListWrapper({
  children
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();
  const isDashboardRoot = pathName === '/me';

  return (
    <div
      className={clsx(styles.yearListWrapper, {
        [styles.hiddenMobile]: !isDashboardRoot
      })}
    >
      {children}
    </div>
  );
}
