import { isAuthorized } from 'lib/authorization';
import { prismaContext } from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { createBet, deleteBet, getBet, updateBet } from 'services/prisma/bets';

interface PostRequestBody {
  playerId: number;
  nominationId: number;
}

interface PatchRequestBody {
  betId: number;
  nominationId: number;
}

interface DeleteRequestBody {
  betId: number;
}

const bets = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    return new Promise((resolve) => {
      const { playerId, nominationId }: PostRequestBody = req.body;

      if (!isAuthorized(req, res, playerId)) {
        res.status(401).end('Unauthorized.');
        resolve('');
      }

      if (!playerId || !nominationId) {
        res.status(400).end('Both playerId and nominationId must be provided');
        resolve('');
      } else {
        createBet(
          {
            player: playerId,
            nomination: nominationId
          },
          prismaContext
        )
          .then((bet) => {
            res.status(200).json(bet);
            resolve('');
          })
          .catch((error) => {
            res.status(500).end(error);
            return resolve('');
          });
      }
    });
  } else if (req.method === 'PATCH') {
    return new Promise(async (resolve) => {
      const { betId, nominationId }: PatchRequestBody = req.body;
      if (!betId || !nominationId) {
        res.status(400).end('Both betId and nominationId must be provided');
        return resolve('');
      } else {
        const fullBet = await getBet(betId, prismaContext);

        if (!fullBet) {
          res.status(400).end('Failed to fetch bet');
          return resolve('');
        }

        if (!isAuthorized(req, res, fullBet.player)) {
          res.status(401).end('Unauthorized.');
          return resolve('');
        }

        updateBet(betId, nominationId, prismaContext)
          .then((bet) => {
            res.status(200).json(bet);
            resolve('');
          })
          .catch((error) => {
            res.status(500).end(error);
            return resolve('');
          });
      }
    });
  } else if (req.method === 'DELETE') {
    return new Promise(async (resolve, reject) => {
      const { betId }: DeleteRequestBody = req.body;
      if (!betId) {
        res.status(400).end('BetId must be provided');
        resolve('');
      } else {
        const fullBet = await getBet(betId, prismaContext);

        if (!fullBet) {
          res.status(400).end('Failed to fetch bet');
          return resolve('');
        }

        if (!isAuthorized(req, res, fullBet.player)) {
          res.status(401).end('Unauthorized.');
          return resolve('');
        }

        deleteBet(betId, prismaContext)
          .then((bet) => {
            res.status(200).json(bet);
            return resolve('');
          })
          .catch((error) => {
            console.log(error);
            res.status(500).end('Internal server error');
            return reject('');
          });
      }
    });
  } else {
    res.status(404).end();
  }
};

export default bets;
