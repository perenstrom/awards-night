import { isAuthorized } from 'lib/authorization';
import { prismaContext } from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getBetsForPlayer } from 'services/prisma/bets';

interface GetRequestQuery {
  playerId: string;
}

const playerBets = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    return new Promise((resolve) => {
      const { playerId } = req.query as unknown as GetRequestQuery;
      const parsedPlayerId = parseInt(playerId, 10);

      if (!isAuthorized(req, res, parsedPlayerId)) {
        res.status(401).end('Unauthorized.');
        resolve('');
      }

      getBetsForPlayer(parsedPlayerId, prismaContext)
        .then((bets) => {
          res.status(200).json(bets);
          resolve('');
        })
        .catch((error) => {
          res.status(500).end(error);
          return resolve('');
        });
    });
  } else {
    res.status(404).end();
  }
};

export default playerBets;
