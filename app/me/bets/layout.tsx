import React from 'react';
import { redirect } from 'next/navigation';
import YearList from 'components/dashboard/YearList';
import { auth0 } from 'lib/auth0';

export default async function BetsLayout({
  children
}: {
  children?: React.ReactNode;
}) {
  const session = await auth0.getSession();
  if (!session) redirect('/');

  return (
    <div className="flex min-h-screen w-screen">
      <YearList />
      {children}
    </div>
  );
}
