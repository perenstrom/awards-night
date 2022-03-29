import { rest } from 'msw';
import { PlayerId } from 'types/nominations';
import {
  airtableFormulaToArray,
  extractAirtableFormulaFromSearch
} from '__test__/test-utils';
import { getPlayersResponse } from '__test__/__fixtures__/airtable/getPlayersResponse';

export const mockGetPlayers = () => {
  return {
    handler: rest.get(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_DATABASE}/players`,
      (req, res, ctx) => {
        const players = airtableFormulaToArray(
          extractAirtableFormulaFromSearch(decodeURIComponent(req.url.search))
        );

        return res(
          ctx.status(200),
          ctx.json(getPlayersResponse(players as PlayerId[]))
        );
      }
    )
  };
};
