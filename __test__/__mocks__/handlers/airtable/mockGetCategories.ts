import { rest } from 'msw';
import {
  airtableFormulaToArray,
  extractAirtableFormulaFromSearch
} from '__test__/test-utils';
import { getCategoriesResponse } from '__test__/__fixtures__/airtable/getCategoriesResponse';

export const mockGetCategories = () => {
  return {
    handler: rest.get(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_DATABASE}/categories`,
      (req, res, ctx) => {
        const categories = airtableFormulaToArray(
          extractAirtableFormulaFromSearch(decodeURIComponent(req.url.search))
        );

        return res(
          ctx.status(200),
          ctx.json(getCategoriesResponse(categories))
        );
      }
    )
  };
};
