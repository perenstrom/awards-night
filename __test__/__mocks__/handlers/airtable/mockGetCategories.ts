import { rest } from 'msw';
import { getCategoryResponse } from '__test__/__fixtures__/airtable/getCategoriesResponse';

export const mockGetCategories = () => {
  return {
    handler: rest.get(
      'https://api.airtable.com/v0/fake-db/categories',
      (_, res, ctx) => {
        return res(
          ctx.status(200),

          ctx.json(getCategoryResponse())
        );
      }
    )
  };
};
