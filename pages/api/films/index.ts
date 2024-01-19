import { saveFilm, saveFilmByTmdbId } from 'lib/saveFilm';
import { isAdmin } from 'lib/authorization';
import { NextApiRequest, NextApiResponse } from 'next';

interface PostRequestBody {
  imdbId?: string;
  tmdbId?: string;
}

const films = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    return new Promise(async (resolve) => {
      if (!(await isAdmin(req, res))) {
        res.status(401).end('Admin privileges required.');
        resolve('');
      }

      const { imdbId, tmdbId }: PostRequestBody = req.body;
      if (!imdbId && !tmdbId) {
        res.status(400).end('ImdbId or TmdbId must be provided');
        resolve('');
      } else {
        if (imdbId) {
          saveFilm(imdbId)
            .then((statusMessage) => {
              res.status(200).json(statusMessage);
              resolve('');
            })
            .catch((error) => {
              res.status(500).end(error);
              return resolve('');
            });
        }

        if (tmdbId) {
          saveFilmByTmdbId(tmdbId)
            .then((statusMessage) => {
              res.status(200).json(statusMessage);
              resolve('');
            })
            .catch((error) => {
              res.status(500).end(error);
              return resolve('');
            });
        }
      }
    });
  } else {
    res.status(404).end();
  }
};

export default films;
