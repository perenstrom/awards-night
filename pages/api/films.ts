import { getSession } from '@auth0/nextjs-auth0';
import { saveFilm } from 'lib/saveFilm';
import { isAdmin, isAdminKey } from 'lib/withAdminRequired';
import { NextApiRequest, NextApiResponse } from 'next';
import { BetRecord, createBet } from 'services/airtable';
import { PlayerId, NominationId } from 'types/nominations';

interface PostRequestBody {
  imdbId: string;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    return new Promise((resolve) => {
      if (!isAdmin(req, res)) {
        res.status(401).end('Admin privileges required.');
        resolve('');
      }

      const { imdbId }: PostRequestBody = req.body;
      if (!imdbId) {
        res.status(400).end('ImdbId must be provided');
        resolve('');
      } else {
        saveFilm(imdbId)
          .then((statusMessage) => {
            res.status(200).end(JSON.stringify(statusMessage));
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