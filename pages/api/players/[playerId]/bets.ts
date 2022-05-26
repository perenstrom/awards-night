import { isAuthorized } from 'lib/authorization';
import { NextApiRequest, NextApiResponse } from 'next';

const playerBets = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    return new Promise((resolve) => {
      const { playerId } = req.query;

      if (!isAuthorized(req, res, playerId)) {
        res.status(401).end('Unauthorized.');
        resolve('');
      }

      getBetsForPlayer(playerId)
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
