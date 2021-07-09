import { NextApiRequest, NextApiResponse } from 'next';
import { getBetsForPlayer } from 'services/airtable';
import { PlayerId } from 'types/nominations';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    return new Promise((resolve) => {
      const { playerId } = req.query;

      getBetsForPlayer(playerId as PlayerId)
        .then((bets) => {
          res.status(200).end(JSON.stringify(bets));
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
