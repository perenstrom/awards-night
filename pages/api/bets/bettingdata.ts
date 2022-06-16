import { NextApiRequest, NextApiResponse } from 'next';
import { isAuthorized } from 'lib/authorization';
import { getBettingData } from 'lib/getBettingData';
import { prismaContext } from 'lib/prisma';

import type { NominationData } from 'types/nominations';

interface PostRequestBody {
  nominationData: NominationData;
  group: number;
  playerId: number;
}

const bettingData = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    return new Promise(async (resolve) => {
      const { nominationData, group, playerId }: PostRequestBody = req.body;

      if (!isAuthorized(req, res, playerId)) {
        res.status(401).end('Unauthorized.');
        resolve('');
      }

      if (!nominationData || !group || !playerId) {
        res
          .status(400)
          .end('NominationData, group and playerId must be provided');
        resolve('');
      } else {
        getBettingData(nominationData, group, prismaContext)
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
