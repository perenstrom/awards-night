import { getSession } from '@auth0/nextjs-auth0';
import { getPlayerByAuth0Id } from 'services/prisma/players';

export const getLoggedInPlayer = async () => {
  const session = await getSession();
  console.log(JSON.stringify(session, null, 2));
  const user = session?.user ?? null;
  const auth0id = user?.sub as string;

  if (!auth0id) {
    console.log('No auth0id found on user session');

    return null;
  }
  const player = await getPlayerByAuth0Id(auth0id);
  console.log(JSON.stringify(player, null, 2));

  return player;
};
