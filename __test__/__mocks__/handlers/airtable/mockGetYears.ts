import { rest } from 'msw';
import { getYearsResponse } from '__test__/__fixtures__/airtable/getYearsResponse';

export const mockGetYears = (years?: string[]) => {
  return {
    handler: rest.get(
      'https://api.airtable.com/v0/fake-db/years',
      (_, res, ctx) => {
        return res(
          ctx.status(200),

          ctx.json(getYearsResponse(years))
        );
      }
    )
  };
};
