import { rest } from 'msw';
import { airtableFormulaToArray, extractAirtableFormulaFromSearch } from '__test__/test-utils';
import { getFilmsResponse } from '__test__/__fixtures__/airtable/getFilmsResponse';

export const mockGetFilms = () => {
  return {
    handler: rest.get(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_DATABASE}/films`,
      (req, res, ctx) => {
        const films = airtableFormulaToArray(
          extractAirtableFormulaFromSearch(decodeURIComponent(req.url.search))
        );

        return res(
          ctx.status(200),
          ctx.json(getFilmsResponse(films))
        );
      }
    )
  };
};
