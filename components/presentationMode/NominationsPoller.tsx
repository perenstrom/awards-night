'use client';

import { usePathname } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { revalidatePath } from 'app/[year]/[category]/actions';

export const NominationsPoller = (props: {
  bettingOpen: boolean;
  children: React.ReactNode;
}) => {
  const { children, bettingOpen } = props;
  const pathName = usePathname();

  const refreshNominations = useCallback(async () => {
    if (pathName) revalidatePath('/');
  }, [pathName]);

  useEffect(() => {
    if (!bettingOpen) {
      const interval = setInterval(refreshNominations, 10000);

      return () => clearInterval(interval);
    }
  }, [bettingOpen, refreshNominations]);

  return <>{children}</>;
};
