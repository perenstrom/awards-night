import { NextApiRequest, NextApiResponse } from 'next';
import { getNominationData } from 'lib/getNominationData';
import { prisma } from 'lib/prisma';

const test = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    return new Promise(async () => {
      const year = await getNominationData(2021, { prisma });
      res.end(JSON.stringify(year, null, 2));
    });
  } else {
    res.status(404).end();
  }
};

export default test;
