'use client';

import { clsx } from 'clsx';
import { usePathname } from 'next/navigation';

interface Props {
  year: number;
  children: React.ReactNode;
}

export const YearCardWrapper: React.FC<Props> = ({ children, year }) => {
  const pathname = usePathname();
  const isCurrentRoute = pathname.includes(year.toString());

  return (
    <div
      className={clsx(
        'rounded-md mb-2 flex flex-col px-[10px] pb-[10px] pt-3 bg-[#333] font-[Inter,sans-serif] text-text-primary border-solid border-l-active-green transition-[border-left-width] duration-300 ease-in-out',
        isCurrentRoute ? 'border-l-[5px]' : 'border-l-0'
      )}
    >
      {children}
    </div>
  );
};
