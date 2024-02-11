import { getSession } from '@auth0/nextjs-auth0';
import { getPlayerByAuth0Id } from 'services/prisma/players';

export const getLoggedInPlayer = async () => {
  const session = await getSession();
  const user = session?.user ?? null;
  const auth0id = user?.sub as string;

  if (!auth0id) {
    console.log('No auth0id found on user session');

    return null;
  }

  return await getPlayerByAuth0Id(auth0id);
};
