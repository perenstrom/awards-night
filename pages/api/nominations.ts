import { refreshNominations } from 'lib/refreshNominations';
import { saveNominations } from 'lib/saveNominations';
import { isAdmin } from 'lib/withAdminRequired';
import { NextApiRequest, NextApiResponse } from 'next';
import { getYear, updateNomination } from 'services/airtable';
import { airtableMap } from 'services/maps/airtableMap';
import {
  CategoryId,
  FilmId,
  Nomination,
  NominationId,
} from 'types/nominations';

interface PatchRequestBody {
  nominationId: NominationId;
  nomination: Nomination;
}

interface PostRequestBody {
  category: CategoryId;
  year: number;
  films: FilmId[];
  nominees: string[];
}

const nominations = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { year } = req.query;
    const fullYear = await getYear(parseInt(year as string, 10));
    const nominations = await refreshNominations(fullYear);

    res.end(JSON.stringify(nominations));
  } else if (req.method === 'PATCH') {
    return new Promise((resolve) => {
      if (!isAdmin(req, res)) {
        res.status(401).end('Admin privileges required.');
        resolve('');
      }

      const { nominationId, nomination }: PatchRequestBody = req.body;
      if (!nominationId || !nomination) {
        res
          .status(400)
          .end('Both nominationId and nomination must be provided');
        resolve('');
      } else {
        updateNomination(nominationId, airtableMap.nomination.toAirtable(nomination))
          .then((nomination) => {
            res.status(200).json(nomination);
            resolve('');
          })
          .catch((error) => {
            res.status(500).end(error);
            return resolve('');
          });
      }
    });
  } else if (req.method === 'POST') {
    return new Promise((resolve) => {
      if (!isAdmin(req, res)) {
        res.status(401).end('Admin privileges required.');
        resolve('');
      }

      const { category, year, films, nominees }: PostRequestBody = req.body;
      if (!category || !year || !films || !nominees) {
        res
          .status(400)
          .end('Category, year, films and nominees must be provided');
        resolve('');
      } else {
        saveNominations({ category, year, films, nominees })
          .then((statusMessage) => {
            res.status(200).json(statusMessage);
            resolve('');
          })
          .catch((error) => {
            res.status(500).end(error);
            return resolve('');
          });
      }
    });
  } else {
    res.status(404);
  }
};

export default nominations;
