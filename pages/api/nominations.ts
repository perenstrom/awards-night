import { refreshNominations } from 'lib/getCategoryData';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const nominations = await refreshNominations();
    res.end(JSON.stringify(nominations));
  } else {
    res.status(404);
  }
};
