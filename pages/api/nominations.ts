import { refreshNominations } from 'lib/refreshNominations';
import { saveNominations } from 'lib/saveNominations';
import { isAdmin } from 'lib/authorization';
import { NextApiRequest, NextApiResponse } from 'next';
import { Nomination } from 'types/nominations';
import { prismaContext } from 'lib/prisma';
import { getYear } from 'services/prisma';
import { prismaMap } from 'services/maps/prismaMap';
import { updateNomination } from 'services/prisma/nominations';

interface PatchRequestBody {
  nominationId: number;
  nomination: Nomination;
}

interface PostRequestBody {
  category: string;
  year: number;
  films: string[];
  nominees: string[];
}

const nominations = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { year } = req.query;
    try {
      const fullYear = await getYear(
        parseInt(year as string, 10),
        prismaContext
      );
      if (fullYear) {
        const nominations = await refreshNominations(fullYear);

        res.end(JSON.stringify(nominations));
      } else {
        res.status(404).end('No data found for that year');
      }
    } catch (error) {
      console.error(error);
      res.status(500).end('Internal server error');
    }
  } else if (req.method === 'PATCH') {
    return new Promise(async (resolve) => {
      if (!(await isAdmin(req, res))) {
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
        updateNomination(
          nominationId,
          prismaMap.nomination.toPrisma(nomination),
          prismaContext
        )
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
  } else {
    res.status(404);
  }
};

export default nominations;
