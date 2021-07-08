import { rest } from 'msw';
import { getPlayersResponse } from '__test__/__fixtures__/airtable/getPlayersResponse';

export const mockGetPlayers = (players?: string[]) => {
  return {
    handler: rest.get(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_DATABASE}/players`,
      (_, res, ctx) => {
        return res(
          ctx.status(200),

          ctx.json(getPlayersResponse(players))
        );
      }
    )
  };
};
