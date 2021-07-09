import { rest } from 'msw';
import {
  airtableFormulaToArray,
  extractAirtableFormulaFromSearch
} from '__test__/test-utils';
import { getNominationsResponse } from '__test__/__fixtures__/airtable/getNominationsResponse';

export const mockGetNominations = () => {
  return {
    handler: rest.get(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_DATABASE}/nominations`,
      (req, res, ctx) => {
        const nominations = airtableFormulaToArray(
          extractAirtableFormulaFromSearch(decodeURIComponent(req.url.search))
        );

        return res(
          ctx.status(200),
          ctx.json(getNominationsResponse(nominations))
        );
      }
    )
  };
};
