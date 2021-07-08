import { rest } from 'msw';
import { getCategoriesResponse } from '__test__/__fixtures__/airtable/getCategoriesResponse';

export const mockGetCategories = (categories?: string[]) => {
  return {
    handler: rest.get(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_DATABASE}/categories`,
      (_, res, ctx) => {
        return res(
          ctx.status(200),

          ctx.json(getCategoriesResponse(categories))
        );
      }
    )
  };
};
