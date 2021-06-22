import { rest } from 'msw';
import { getNominationsResponse } from '__test__/__fixtures__/airtable/getNominationsResponse';

export const mockGetNominations = (nominations?: string[]) => {
  return {
    handler: rest.get(
      'https://api.airtable.com/v0/fake-db/nominations',
      (_, res, ctx) => {
        return res(
          ctx.status(200),

          ctx.json(getNominationsResponse(nominations))
        );
      }
    )
  };
};
