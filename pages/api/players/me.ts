import {
  getSession,
  UserProfile,
  withApiAuthRequired
} from '@auth0/nextjs-auth0';
import AirtableError from 'airtable/lib/airtable_error';
import { NextApiRequest, NextApiResponse } from 'next';
import { getPlayerByAuth0Id } from 'services/airtable';

const getPlayer = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  return new Promise((resolve) => {
    if (req.method === 'GET') {
      const { user } = <{ user: UserProfile }>getSession(req, res);

      const { sub: auth0id } = user;

      if (!auth0id) {
        res.status(404).end();
        return resolve();
      }

      getPlayerByAuth0Id(auth0id as string)
        .then((player) => {
          if (player) {
            res.status(200).end(JSON.stringify(player));
            return resolve();
          } else {
            res.status(404).end();
            return resolve();
          }
        })
        .catch((error) => {
          if (error instanceof AirtableError) {
            res.status(500).end(error.message);
          } else {
            console.log(error);
            res.status(500).end('Internal server error');
          }
          return resolve();
        });
    } else {
      res.status(404).end();
      return resolve();
    }
  });
};

export default withApiAuthRequired(getPlayer);
