import React from 'react';
import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';
import YearList from 'components/dashboard/YearList';
import styles from './me.module.scss';

export default withPageAuthRequired(
  async function MeLayout({ children }: { children?: React.ReactNode }) {
    const session = await getSession();
    if (!session) redirect('/');

    return (
      <div className={styles.mainWrapper}>
        <YearList />
        {children}
      </div>
    );
  },
  { returnTo: '/me' }
);
