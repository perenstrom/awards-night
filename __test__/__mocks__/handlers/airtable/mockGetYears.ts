import { rest } from 'msw';
import { YearId } from 'types/nominations';
import {
  airtableFormulaToArray,
  extractAirtableFormulaFromSearch
} from '__test__/test-utils';
import { getYearsResponse } from '__test__/__fixtures__/airtable/getYearsResponse';

export const mockGetYears = () => {
  return {
    handler: rest.get(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_DATABASE}/years`,
      (req, res, ctx) => {
        const years = airtableFormulaToArray(
          extractAirtableFormulaFromSearch(decodeURIComponent(req.url.search))
        );

        return res(
          ctx.status(200),
          ctx.json(getYearsResponse(years as YearId[]))
        );
      }
    )
  };
};
