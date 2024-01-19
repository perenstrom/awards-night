import { isAuthorized } from 'lib/authorization';
import { prismaContext } from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getBetsForPlayer } from 'services/prisma/bets';

interface GetRequestQuery {
  playerId: string;
}

const playerBets = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  return new Promise(async (resolve) => {
    if (req.method === 'GET') {
      const { playerId } = req.query as unknown as GetRequestQuery;
      const parsedPlayerId = parseInt(playerId, 10);

      if (!(await isAuthorized(req, res, parsedPlayerId))) {
        res.status(401).end('Unauthorized.');
        return resolve();
      }

      getBetsForPlayer(parsedPlayerId, prismaContext)
        .then((bets) => {
          res.status(200).json(bets);
          return resolve();
        })
        .catch((error) => {
          res.status(500).end(error);
          return resolve();
        });
    } else {
      res.status(404).end();
      return resolve();
    }
  });
};

export default playerBets;
