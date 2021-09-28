import { isAdmin } from 'lib/withAdminRequired';
import { NextApiRequest, NextApiResponse } from 'next';
import { searchFilm } from 'services/tmdb';

interface GetRequestQuery {
  query: string;
}

const films = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    return new Promise((resolve) => {
      if (!isAdmin(req, res)) {
        res.status(401).end('Admin privileges required.');
        resolve('');
      }

      const { query } = req.query as unknown as GetRequestQuery;
      if (!query) {
        res.status(400).end('Query must be provided');
        resolve('');
      } else {
        searchFilm(query)
          .then((films) => {
            res.status(200).json(films);
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

export default films;
