import { Player } from '@prisma/client';
import { PlayerWithBets } from 'services/prisma/prisma.types';

export const getPlayersResponseFixture = (group: number): Player[] => {
  const players: Record<number, PlayerWithBets[]> = {
    1: [
      {
        id: 1,
        auth0UserId: 'user1',
        name: 'Player 1',
        groupId: 1,
        bets: [
          { id: 3, nominationId: 1, playerId: 1 },
          { id: 5, nominationId: 12, playerId: 1 }
        ]
      },
      {
        id: 2,
        auth0UserId: 'user2',
        name: 'Player 2',
        groupId: 1,
        bets: [
          { id: 4, nominationId: 4, playerId: 2 },
          { id: 6, nominationId: 12, playerId: 2 }
        ]
      }
    ],
    2: [
      {
        id: 3,
        auth0UserId: 'user3',
        name: 'Player 3',
        groupId: 1,
        bets: [{ id: 3, nominationId: 2, playerId: 3 }]
      }
    ]
  };
  return players[group];
};

export const getPlayersWithBetsResponseFixture = (
  group: number
): PlayerWithBets[] => {
  const players: Record<number, PlayerWithBets[]> = {
    1: [
      {
        id: 1,
        auth0UserId: 'user1',
        name: 'Player 1',
        bets: [
          {
            id: 3,
            playerId: 1,
            nominationId: 1
          },
          {
            id: 5,
            playerId: 1,
            nominationId: 12
          }
        ],
        groupId: 1
      },
      {
        id: 2,
        auth0UserId: 'user2',
        name: 'Player 2',
        bets: [
          {
            id: 4,
            playerId: 2,
            nominationId: 4
          },
          {
            id: 6,
            playerId: 2,
            nominationId: 12
          }
        ],
        groupId: 1
      }
    ],
    2: [
      {
        id: 3,
        auth0UserId: 'user3',
        name: 'Player 3',
        bets: [
          {
            id: 7,
            playerId: 3,
            nominationId: 12
          }
        ],
        groupId: 1
      }
    ]
  };
  return players[group];
};
