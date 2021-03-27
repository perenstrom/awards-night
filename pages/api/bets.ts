import { NextApiRequest, NextApiResponse } from 'next';
import { BetRecord, createBet } from 'services/airtable';

interface RequestBody {
  playerId: string;
  nominationId: string;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { playerId, nominationId }: RequestBody = req.body;
    if (!playerId || !nominationId) {
      res.status(400).end('Both playerId and nominationId must be provided');
    } else {
      const newBet: BetRecord = {
        player: [playerId],
        nomination: [nominationId]
      };
      createBet(newBet)
        .then((bet) => res.end(JSON.stringify(bet)))
        .catch((error) => res.status(500).end(error));
    }
  } else {
    res.status(404).end();
  }
};
