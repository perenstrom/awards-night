import React from 'react';
import { redirect } from 'next/navigation';
import { auth0 } from 'lib/auth0';
import styles from './me.module.scss';

export default async function MeLayout({
  children
}: {
  children?: React.ReactNode;
}) {
  const session = await auth0.getSession();
  if (!session) redirect('/');

  return <div className={styles.mainWrapper}>{children}</div>;
}
