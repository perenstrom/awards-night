import { isAuthorized } from 'lib/authorization';
import { getBettingData } from 'lib/getBettingData';
import { NextApiRequest, NextApiResponse } from 'next';
import { getPlayers } from 'services/airtable';
import {
  NormalizedCategories,
  NormalizedNominations,
  PlayerId,
  Year
} from 'types/nominations';

interface PostRequestBody {
  year: Year;
  categories: NormalizedCategories;
  nominations: NormalizedNominations;
  playerId: PlayerId;
}

const bettingData = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    return new Promise(async (resolve) => {
      const { year, categories, nominations, playerId }: PostRequestBody =
        req.body;

      if (!isAuthorized(req, res, playerId as PlayerId)) {
        res.status(401).end('Unauthorized.');
        resolve('');
      }

      if (!year || !categories || !nominations || !playerId) {
        res
          .status(400)
          .end('Year, categories, nominations and playerId must be provided');
        resolve('');
      } else {
        const playersResult = await getPlayers([playerId]);
        const player = playersResult[0];

        getBettingData(year, categories, nominations, player.group)
          .then((bettingData) => {
            res.status(200).json(bettingData);
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

export default bettingData;
