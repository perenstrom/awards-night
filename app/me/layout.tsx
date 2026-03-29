import React from 'react';
import { redirect } from 'next/navigation';
import { auth0 } from 'lib/auth0';

export default async function MeLayout({
  children
}: {
  children?: React.ReactNode;
}) {
  const session = await auth0.getSession();
  if (!session) redirect('/');

  return (
    <div className="flex min-h-screen w-screen">{children}</div>
  );
}
