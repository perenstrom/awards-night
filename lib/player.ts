import { getPlayerByAuth0Id } from 'services/prisma/players';
import { auth0 } from './auth0';

export const getLoggedInPlayer = async () => {
  const session = await auth0.getSession();
  const user = session?.user ?? null;
  const auth0id = user?.sub as string;

  if (!auth0id) {
    console.log('No auth0id found on user session');

    return null;
  }
  const player = await getPlayerByAuth0Id(auth0id);

  return player;
};
