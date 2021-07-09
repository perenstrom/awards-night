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
  if (req.method === 'GET') {
    const { user } = <{ user: UserProfile }>getSession(req, res);

    return new Promise((resolve) => {
      const { sub: auth0id } = user;

      if (!auth0id) {
        res.status(404).end();
        return resolve();
      }

      getPlayerByAuth0Id(auth0id as string)
        .then((player) => {
          if (player) {
            res.status(200).end(JSON.stringify(player));
            resolve();
          } else {
            res.status(404).end();
            return resolve();
          }
        })
        .catch((error) => {
          if (error instanceof AirtableError) {
            res.status(500).end(error.message);
          } else {
            res.status(500).end('Internal server error');
          }
          return resolve();
        });
    });
  } else {
    res.status(404).end();
  }
};

export default withApiAuthRequired(getPlayer);
