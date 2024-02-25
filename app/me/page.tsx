import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'My predictions – Awards Night'
};

export default withPageAuthRequired(
  async function Page() {
    const session = await getSession();
    if (!session) redirect('/');
    return <></>;
  },
  { returnTo: '/me' }
);
