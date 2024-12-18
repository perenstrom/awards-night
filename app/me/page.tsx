import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth0 } from 'lib/auth0';

export const metadata: Metadata = {
  title: 'My predictions – Awards Night'
};

export default async function Page() {
  const session = await auth0.getSession();
  if (!session) redirect('/');
  return <></>;
}
