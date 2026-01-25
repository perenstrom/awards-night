import React from 'react';
import { redirect } from 'next/navigation';
import YearList from 'components/dashboard/YearList';
import { auth0 } from 'lib/auth0';
import styles from '../me.module.scss';

export default async function BetsLayout({
  children
}: {
  children?: React.ReactNode;
}) {
  const session = await auth0.getSession();
  if (!session) redirect('/');

  return (
    <div className={styles.mainWrapper}>
      <YearList />
      {children}
    </div>
  );
}
