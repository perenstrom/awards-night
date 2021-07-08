import { rest } from 'msw';
import { getBetsResponse } from '__test__/__fixtures__/airtable/getBetsResponse';

export const mockGetBets = (bets?: string[]) => {
  return {
    handler: rest.get(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_DATABASE}/bets`,
      (_, res, ctx) => {
        return res(
          ctx.status(200),

          ctx.json(getBetsResponse(bets))
        );
      }
    )
  };
};
