import { rest } from 'msw';
import { BetId } from 'types/nominations';
import {
  airtableFormulaToArray,
  extractAirtableFormulaFromSearch
} from '__test__/test-utils';
import { getBetsResponse } from '__test__/__fixtures__/airtable/getBetsResponse';

export const mockGetBets = () => {
  return {
    handler: rest.get(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_DATABASE}/bets`,
      (req, res, ctx) => {
        const bets = airtableFormulaToArray(
          extractAirtableFormulaFromSearch(decodeURIComponent(req.url.search))
        );

        return res(ctx.status(200), ctx.json(getBetsResponse(bets as BetId[])));
      }
    )
  };
};
