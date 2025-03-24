'use client';

import { usePathname } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { revalidatePath } from 'app/[year]/[category]/actions';

export const NominationsPoller = (props: {
  bettingOpen: boolean;
  awardsFinished: boolean;
  children: React.ReactNode;
}) => {
  const { children, bettingOpen, awardsFinished } = props;
  const pathName = usePathname();

  const refreshNominations = useCallback(async () => {
    if (pathName) revalidatePath('/');
  }, [pathName]);

  useEffect(() => {
    if (!bettingOpen && !awardsFinished) {
      const interval = setInterval(refreshNominations, 10000);

      return () => clearInterval(interval);
    }
  }, [awardsFinished, bettingOpen, refreshNominations]);

  return <>{children}</>;
};
