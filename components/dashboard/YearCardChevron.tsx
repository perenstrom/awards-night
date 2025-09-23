'use client';

import { clsx } from 'clsx';
import { usePathname } from 'next/navigation';

interface Props {
  year: number;
}

export const YearCardChevron = ({ year }: Props) => {
  const pathname = usePathname();
  const isCurrentRoute = pathname.includes(year.toString());

  const className = isCurrentRoute
    ? 'fill-primary-weak-invisible'
    : 'fill-primary-weak';

  return (
    <svg
      width="7"
      height="13"
      viewBox="0 0 7 13"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx(className, 'transition-[fill] duration-200')}
    >
      <path d="M6.76502 5.92612C7.07752 6.24351 7.07752 6.75894 6.76502 7.07632L1.96502 11.9513C1.65252 12.2687 1.14502 12.2687 0.83252 11.9513C0.52002 11.6339 0.52002 11.1185 0.83252 10.8011L5.06752 6.49995L0.835019 2.19878C0.522519 1.8814 0.522519 1.36597 0.835019 1.04858C1.14752 0.731201 1.65502 0.731201 1.96752 1.04858L6.76752 5.92358L6.76502 5.92612Z" />
    </svg>
  );
};
