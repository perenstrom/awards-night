import { refreshNominations } from 'lib/refreshNominations';
import { NextApiRequest, NextApiResponse } from 'next';
import { getYear, NominationRecord, updateNomination } from 'services/airtable';
import { Nomination, NominationId } from 'types/nominations';

interface PatchRequestBody {
  nominationId: NominationId;
  nomination: Nomination;
}

const mapNomination = (nomination: Nomination): NominationRecord => ({
  year: nomination.year,
  category: nomination.category && [nomination.category],
  film: nomination.category && [nomination.film],
  nominee: nomination.nominee,
  won: nomination.won
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { year } = req.query;
    const fullYear = await getYear(parseInt(year as string, 10));
    const nominations = await refreshNominations(fullYear);

    res.end(JSON.stringify(nominations));
  } else if (req.method === 'PATCH') {
    return new Promise((resolve) => {
      const { nominationId, nomination }: PatchRequestBody = req.body;
      if (!nominationId || !nomination) {
        res
          .status(400)
          .end('Both nominationId and nomination must be provided');
        resolve('');
      } else {
        updateNomination(nominationId, mapNomination(nomination))
          .then((nomination) => {
            res.status(200).end(JSON.stringify(nomination));
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
