import { BettingData } from 'types/nominations';
import { mockRequests } from '__test__/test-utils';
import { getNormalizedCategoriesFixture } from '__test__/__fixtures__/getNormalizedCategoriesFixture';
import { getNormalizedNominationsFixture } from '__test__/__fixtures__/getNormalizedNominationsFixture';
import { getYearFixture } from '__test__/__fixtures__/getYearFixture';
import { mockGetBets } from '__test__/__mocks__/handlers/airtable/mockGetBets';
import { mockGetPlayers } from '__test__/__mocks__/handlers/airtable/mockGetPlayers';
import { server } from '__test__/__mocks__/mswServer';
import { getBettingData } from './getBettingData';

describe('getBettingData', () => {
  mockRequests();

  it('returns correct betting data for a year, without bets (betting open)', async () => {
    const nominationsToFetch = [
      'nomination-2020-best-adapted-screenplay-1',
      'nomination-2020-best-adapted-screenplay-2',
      'nomination-2020-best-picture-1',
      'nomination-2020-best-picture-2'
    ];
    server.use(mockGetBets(['bet-1', 'bet-2']).handler);
    server.use(mockGetPlayers().handler);

    const bettingData = await getBettingData(
      getYearFixture(2020),
      getNormalizedCategoriesFixture(2020),
      getNormalizedNominationsFixture(nominationsToFetch)
    );

    const expectedBettingData: BettingData = {
      bets: {},
      players: {
        'player-1': {
          id: 'player-1',
          name: 'Player 1',
          correct: 0,
          bets: []
        },
        'player-2': {
          id: 'player-2',
          name: 'Player 2',
          correct: 0,
          bets: []
        }
      }
    };

    expect(bettingData).toEqual(expectedBettingData);
  });

  it('returns correct betting data for a year, with bets (betting closed)', async () => {
    const nominationsToFetch = [
      'nomination-2021-best-animated-short-1',
      'nomination-2021-best-animated-short-2',
      'nomination-2021-best-picture-1',
      'nomination-2021-best-picture-2'
    ];
    server.use(mockGetBets(['bet-3', 'bet-4', 'bet-5', 'bet-6']).handler);
    server.use(mockGetPlayers().handler);

    const bettingData = await getBettingData(
      getYearFixture(2021),
      getNormalizedCategoriesFixture(2021),
      getNormalizedNominationsFixture(nominationsToFetch)
    );

    const expectedBettingData: BettingData = {
      bets: {
        'bet-3': {
          id: 'bet-3',
          player: 'player-1',
          nomination: 'nomination-2021-best-animated-short-1'
        },
        'bet-4': {
          id: 'bet-4',
          player: 'player-2',
          nomination: 'nomination-2021-best-animated-short-2'
        },
        'bet-5': {
          id: 'bet-5',
          player: 'player-1',
          nomination: 'nomination-2021-best-picture-1'
        },
        'bet-6': {
          id: 'bet-6',
          player: 'player-2',
          nomination: 'nomination-2021-best-picture-1'
        }
      },
      players: {
        'player-1': {
          id: 'player-1',
          name: 'Player 1',
          correct: 1,
          bets: ['bet-3', 'bet-5']
        },
        'player-2': {
          id: 'player-2',
          name: 'Player 2',
          correct: 2,
          bets: ['bet-4', 'bet-6']
        }
      }
    };

    expect(bettingData).toEqual(expectedBettingData);
  });
});
