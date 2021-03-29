import { NextApiRequest, NextApiResponse } from 'next';
import { BetRecord, createBet, updateBet } from 'services/airtable';

interface PostRequestBody {
  playerId: string;
  nominationId: string;
}

interface PatchRequestBody {
  betId: string;
  nominationId: string;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    return new Promise((resolve) => {
      const { playerId, nominationId }: PostRequestBody = req.body;
      if (!playerId || !nominationId) {
        res.status(400).end('Both playerId and nominationId must be provided');
        resolve('');
      } else {
        const newBet: BetRecord = {
          player: [playerId],
          nomination: [nominationId]
        };
        createBet(newBet)
          .then((bet) => {
            res.status(200).end(JSON.stringify(bet));
            resolve('');
          })
          .catch((error) => {
            res.status(500).end(error);
            return resolve('');
          });
      }
    });
  } else if (req.method === 'PATCH') {
    return new Promise((resolve) => {
      const { betId, nominationId }: PatchRequestBody = req.body;
      if (!betId || !nominationId) {
        res.status(400).end('Both betId and nominationId must be provided');
        resolve('');
      } else {
        updateBet(betId, nominationId)
          .then((bet) => {
            res.status(200).end(JSON.stringify(bet));
            resolve('');
          })
          .catch((error) => {
            res.status(500).end(error);
            return resolve('');
          });
      }
    });
  } else {
    res.status(404).end();
  }
};
