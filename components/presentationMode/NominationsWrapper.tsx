'use client';

import { clsx } from 'clsx';
import { useEffect, useState } from 'react';
import { Nullable } from 'types/utilityTypes';
import styles from './NominationsWrapper.module.scss';

type RestrictedBy = 'height' | 'width';

const getRestrictedBy = (): RestrictedBy | null => {
  if (typeof window !== 'undefined') {
    const windowRatio = window.innerWidth / window.innerHeight;
    const targetContentRatio = 61 / 40;

    const restrictedBy = windowRatio >= targetContentRatio ? 'height' : 'width';

    return restrictedBy;
  }

  return null;
};

export const NominationsWrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [restrictedBy, setRestrictedBy] =
    useState<Nullable<RestrictedBy>>(null);

  useEffect(() => {
    setRestrictedBy(getRestrictedBy());
  }, []);

  const [visible, setVisible] = useState(false);
  useEffect(() => {
    console.log('restrictedBy changed to', restrictedBy);
    if (restrictedBy) {
      const timeOut = setTimeout(() => setVisible(true), 100);

      return () => clearTimeout(timeOut);
    }
  }, [restrictedBy]);

  return (
    <div className={styles.main}>
      <div
        className={clsx(styles.mainWrapper, {
          [styles.heightRestricted]: restrictedBy === 'height' || null,
          [styles.widthRestricted]: restrictedBy === 'width',
          [styles.visible]: visible
        })}
      >
        {children}
      </div>
    </div>
  );
};
