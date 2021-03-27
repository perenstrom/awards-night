import { NextApiRequest, NextApiResponse } from 'next';
import { BetRecord, createBet } from 'services/airtable';

interface RequestBody {
  playerId: string;
  nominationId: string;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    return new Promise((resolve) => {
      const { playerId, nominationId }: RequestBody = req.body;
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
  } else {
    res.status(404).end();
  }
};
