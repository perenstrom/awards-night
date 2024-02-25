import React from 'react';
import YearList from 'components/dashboard/YearList';
import styles from './me.module.scss';

export default async function MeLayout({
  children
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className={styles.mainWrapper}>
      <YearList />
      {children}
    </div>
  );
}
