import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { prismaContext } from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getPlayerByAuth0Id } from 'services/prisma/players';

const getPlayer = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  return new Promise(async (resolve) => {
    if (req.method === 'GET') {
      const session = await getSession(req, res);
      const user = session?.user ?? null;
      const auth0id = user?.sub as string;

      if (!auth0id) {
        console.log('No auth0id found on user session');
        res.status(404).end();
        return resolve();
      }

      getPlayerByAuth0Id(auth0id, prismaContext)
        .then((player) => {
          if (player) {
            res.status(200).json(player);
            return resolve();
          } else {
            console.log(`No player matching auth0id ${auth0id}`);
            res.status(404).end();
            return resolve();
          }
        })
        .catch((error) => {
          console.log(error);
          res.status(500).end('Internal server error');
          return resolve();
        });
    } else {
      res.status(404).end();
      return resolve();
    }
  });
};

export default withApiAuthRequired(getPlayer);
