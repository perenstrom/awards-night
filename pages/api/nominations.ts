import { NextApiRequest, NextApiResponse } from 'next';
import { refreshNominations } from 'lib/refreshNominations';
import { getYear } from 'services/prisma';

const nominations = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { year } = req.query;
    try {
      const fullYear = await getYear(parseInt(year as string, 10));
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
  } else {
    res.status(404);
  }
};

export default nominations;
