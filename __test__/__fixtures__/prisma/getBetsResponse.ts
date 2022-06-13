import { Bet } from '@prisma/client';

export const getBetsResponseFixture = (): Bet[] => {
  const bets: Bet[] = [
    {
      id: 3,
      playerId: 1,
      nominationId: 1
    },
    {
      id: 4,
      playerId: 2,
      nominationId: 4
    },
    {
      id: 5,
      playerId: 1,
      nominationId: 12
    },
    {
      id: 6,
      playerId: 2,
      nominationId: 12
    }
  ];

  return bets;
};
