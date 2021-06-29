import { NominationData, YearId } from 'types/nominations';

import { mockRequests } from '__test__/test-utils';
import { getYear } from '__test__/__fixtures__/getYear';
import { mockGetCategories } from '__test__/__mocks__/handlers/airtable/mockGetCategories';
import { mockGetFilms } from '__test__/__mocks__/handlers/airtable/mockGetFilms';
import { mockGetNominations } from '__test__/__mocks__/handlers/airtable/mockGetNominations';
import { mockGetYears } from '__test__/__mocks__/handlers/airtable/mockGetYears';
import { server } from '__test__/__mocks__/mswServer';

import { getNominationData } from './getNominationData';

describe('getNominationData', () => {
  mockRequests();

  it('returns correct nomination data for a year, without bets', async () => {
    const yearFixture = getYear(2020);
    server.use(mockGetYears(['2020-id']).handler);
    server.use(mockGetCategories(yearFixture.categories).handler);
    server.use(mockGetNominations(yearFixture.nominations).handler);
    server.use(
      mockGetFilms(['citizen-kane', 'moana', 'the-matrix', 'bridget-jones'])
        .handler
    );
    const year = 2020;
    const nominationData = await getNominationData(year);

    const expectedNominationData = {
      year: {
        id: '2020-id' as YearId,
        name: '92rd Academy Awards',
        year: 2020,
        date: '2020-04-25T22:00:00.000Z',
        bettingOpen: true,
        categories: ['best-adapted-screenplay-id', 'best-picture-id'],
        nominations: [
          'nomination-2020-best-adapted-screenplay-1',
          'nomination-2020-best-adapted-screenplay-2',
          'nomination-2020-best-picture-1',
          'nomination-2020-best-picture-2'
        ]
      },
      categories: {
        'best-adapted-screenplay': {
          id: 'best-adapted-screenplay-id',
          name: 'Best Adapted Screenplay',
          nominations: [
            'nomination-2020-best-adapted-screenplay-1',
            'nomination-2020-best-adapted-screenplay-2'
          ],
          previousCategory: null,
          nextCategory: 'best-picture',
          slug: 'best-adapted-screenplay'
        },
        'best-picture': {
          id: 'best-picture-id',
          name: 'Best Picture',
          nominations: [
            'nomination-2020-best-picture-1',
            'nomination-2020-best-picture-2'
          ],
          previousCategory: 'best-adapted-screenplay',
          nextCategory: null,
          slug: 'best-picture'
        }
      },
      nominations: {
        'nomination-2020-best-adapted-screenplay-1': {
          bets: [],
          category: 'best-adapted-screenplay-id',
          decided: null,
          film: 'citizen-kane',
          id: 'nomination-2020-best-adapted-screenplay-1',
          nominee: null,
          won: false,
          year: ['2020-id']
        },
        'nomination-2020-best-adapted-screenplay-2': {
          bets: [],
          category: 'best-adapted-screenplay-id',
          decided: null,
          film: 'moana',
          id: 'nomination-2020-best-adapted-screenplay-2',
          nominee: null,
          won: false,
          year: ['2020-id']
        },
        'nomination-2020-best-picture-1': {
          bets: [],
          category: 'best-picture-id',
          decided: null,
          film: 'the-matrix',
          id: 'nomination-2020-best-picture-1',
          nominee: null,
          won: false,
          year: ['2020-id']
        },
        'nomination-2020-best-picture-2': {
          bets: [],
          category: 'best-picture-id',
          decided: null,
          film: 'bridget-jones',
          id: 'nomination-2020-best-picture-2',
          nominee: null,
          won: false,
          year: ['2020-id']
        }
      },
      films: {
        'citizen-kane': {
          id: 'citizen-kane',
          imdbId: 'imdb-ck',
          name: 'Citizen Kane',
          poster: 'http://image.tmdb.org/t/p/w342/citizen-kane.jpg'
        },
        moana: {
          id: 'moana',
          imdbId: 'imdb-m',
          name: 'Moana',
          poster: 'http://image.tmdb.org/t/p/w342/moana.jpg'
        },
        'the-matrix': {
          id: 'the-matrix',
          imdbId: 'imdb-tm',
          name: 'The Matrix',
          poster: 'http://image.tmdb.org/t/p/w342/the-matrix.jpg'
        },
        'bridget-jones': {
          id: 'bridget-jones',
          imdbId: 'imdb-bj',
          name: 'Bridget Jones',
          poster: 'http://image.tmdb.org/t/p/w342/bridget-jones.jpg'
        }
      },
      meta: {
        completedCategories: 0
      }
    };

    expect(nominationData).toEqual(expectedNominationData);
  });
});
