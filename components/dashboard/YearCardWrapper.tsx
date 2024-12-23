'use client';

import { clsx } from 'clsx';
import { usePathname } from 'next/navigation';
import styles from './YearCardWrapper.module.scss';

interface Props {
  year: number;
  children: React.ReactNode;
}

export const YearCardWrapper: React.FC<Props> = ({ children, year }) => {
  const pathname = usePathname();
  const isCurrentRoute = pathname.includes(year.toString());

  return (
    <div
      className={clsx([styles.wrapper, { [styles.active]: isCurrentRoute }])}
    >
      {children}
    </div>
  );
};
