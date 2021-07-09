import AirtableError from 'airtable/lib/airtable_error';
import { NextApiRequest, NextApiResponse } from 'next';
import { BetRecord, createBet, deleteBet, updateBet } from 'services/airtable';
import { BetId, NominationId, PlayerId } from 'types/nominations';

interface PostRequestBody {
  playerId: string;
  nominationId: string;
}

interface PatchRequestBody {
  betId: string;
  nominationId: string;
}

interface DeleteRequestBody {
  betId: string;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    return new Promise((resolve) => {
      const { playerId, nominationId }: PostRequestBody = req.body;
      if (!playerId || !nominationId) {
        res.status(400).end('Both playerId and nominationId must be provided');
        resolve('');
      } else {
        const newBet: BetRecord = {
          player: [playerId as PlayerId],
          nomination: [nominationId as NominationId]
        };
        createBet(newBet)
          .then((bet) => {
            res.status(200).end(JSON.stringify(bet));
            resolve('');
          })
          .catch((error) => {
            res.status(500).end(error);
            return resolve('');
          });
      }
    });
  } else if (req.method === 'PATCH') {
    return new Promise((resolve) => {
      const { betId, nominationId }: PatchRequestBody = req.body;
      if (!betId || !nominationId) {
        res.status(400).end('Both betId and nominationId must be provided');
        resolve('');
      } else {
        updateBet(betId as BetId, nominationId as NominationId)
          .then((bet) => {
            res.status(200).end(JSON.stringify(bet));
            resolve('');
          })
          .catch((error) => {
            res.status(500).end(error);
            return resolve('');
          });
      }
    });
  } else if (req.method === 'DELETE') {
    return new Promise((resolve, reject) => {
      const { betId }: DeleteRequestBody = req.body;
      if (!betId) {
        res.status(400).end('BetId must be provided');
        resolve('');
      } else {
        deleteBet(betId as BetId)
          .then((bet) => {
            res.status(200).end(JSON.stringify(bet));
            resolve('');
          })
          .catch((error) => {
            if (error instanceof AirtableError) {
              res.status(error.statusCode).end(error.message);
            } else {
              res.status(500).end('Internal server error');
              return reject('');
            }
          });
      }
    });
  } else {
    res.status(404).end();
  }
};
