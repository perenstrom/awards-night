import { BetId, BettingData, GroupId, NominationId, PlayerId } from 'types/nominations';
import { mockRequests } from '__test__/test-utils';
import { getNormalizedCategoriesFixture } from '__test__/__fixtures__/getNormalizedCategoriesFixture';
import { getYearFixture } from '__test__/__fixtures__/getYearFixture';
import { getBettingData } from './getBettingData';

describe('getBettingData', () => {
  mockRequests();

  it('returns correct group betting data for a year, without bets (betting open)', async () => {
    const bettingData = await getBettingData(
      getYearFixture(2020),
      getNormalizedCategoriesFixture(2020),
      'group-1' as GroupId
    );

    const expectedBettingData: BettingData = {
      bets: {},
      players: {
        ['player-1' as PlayerId]: {
          id: 'player-1' as PlayerId,
          name: 'Player 1',
          correct: 0,
          bets: [],
          group: 'group-1' as GroupId
        },
        ['player-2' as PlayerId]: {
          id: 'player-2' as PlayerId,
          name: 'Player 2',
          correct: 0,
          bets: [],
          group: 'group-1' as GroupId
        }
      }
    };

    expect(bettingData).toEqual(expectedBettingData);
  });

  it('returns correct group betting data for a year, with bets (betting closed)', async () => {
    const bettingData = await getBettingData(
      getYearFixture(2021),
      getNormalizedCategoriesFixture(2021),
      'group-1' as GroupId
    );

    const expectedBettingData: BettingData = {
      bets: {
        ['bet-3' as BetId]: {
          id: 'bet-3' as BetId,
          player: 'player-1' as PlayerId,
          nomination: 'nomination-2021-best-animated-short-1' as NominationId
        },
        ['bet-4' as BetId]: {
          id: 'bet-4' as BetId,
          player: 'player-2' as PlayerId,
          nomination: 'nomination-2021-best-animated-short-2' as NominationId
        },
        ['bet-5' as BetId]: {
          id: 'bet-5' as BetId,
          player: 'player-1' as PlayerId,
          nomination: 'nomination-2021-best-picture-1' as NominationId
        },
        ['bet-6' as BetId]: {
          id: 'bet-6' as BetId,
          player: 'player-2' as PlayerId,
          nomination: 'nomination-2021-best-picture-1' as NominationId
        }
      },
      players: {
        ['player-1' as PlayerId]: {
          id: 'player-1' as PlayerId,
          name: 'Player 1',
          correct: 1,
          bets: ['bet-3' as BetId, 'bet-5' as BetId],
          group: 'group-1' as GroupId
        },
        ['player-2' as PlayerId]: {
          id: 'player-2' as PlayerId,
          name: 'Player 2',
          correct: 2,
          bets: ['bet-4' as BetId, 'bet-6' as BetId],
          group: 'group-1' as GroupId
        }
      }
    };

    expect(bettingData).toEqual(expectedBettingData);
  });
});
