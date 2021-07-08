import { YearId } from 'types/nominations';

import { mockRequests } from '__test__/test-utils';
import { getNormalizedCategoriesFixture } from '__test__/__fixtures__/getNormalizedCategoriesFixture';
import { getNormalizedNominationsFixture } from '__test__/__fixtures__/getNormalizedNominationsFixture';
import { getYearFixture } from '__test__/__fixtures__/getYearFixture';
import { mockGetCategories } from '__test__/__mocks__/handlers/airtable/mockGetCategories';
import { mockGetFilms } from '__test__/__mocks__/handlers/airtable/mockGetFilms';
import { mockGetNominations } from '__test__/__mocks__/handlers/airtable/mockGetNominations';
import { mockGetYears } from '__test__/__mocks__/handlers/airtable/mockGetYears';
import { server } from '__test__/__mocks__/mswServer';

import { getNominationData } from './getNominationData';

describe('getNominationData', () => {
  mockRequests();

  it('returns correct nomination data for a year, without bets (betting open)', async () => {
    const yearFixture = getYearFixture(2020);
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
      categories: getNormalizedCategoriesFixture(2020),
      nominations: getNormalizedNominationsFixture([
        'nomination-2020-best-adapted-screenplay-1',
        'nomination-2020-best-adapted-screenplay-2',
        'nomination-2020-best-picture-1',
        'nomination-2020-best-picture-2'
      ]),
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

  it('returns correct nomination data for a year, with bets (betting closed)', async () => {
    const yearFixture = getYearFixture(2021);
    server.use(mockGetYears(['2021-id']).handler);
    server.use(mockGetCategories(yearFixture.categories).handler);
    server.use(mockGetNominations(yearFixture.nominations).handler);
    server.use(
      mockGetFilms([
        'failsafe',
        'twelve-angry-men',
        'legally-blond',
        'legally-blond-2'
      ]).handler
    );
    const year = 2021;
    const nominationData = await getNominationData(year);

    const expectedNominationData = {
      year: {
        id: '2021-id' as YearId,
        name: '93rd Academy Awards',
        year: 2021,
        date: '2021-04-25T22:00:00.000Z',
        bettingOpen: false,
        categories: ['best-animated-short-id', 'best-picture-id'],
        nominations: [
          'nomination-2021-best-animated-short-1',
          'nomination-2021-best-animated-short-2',
          'nomination-2021-best-picture-1',
          'nomination-2021-best-picture-2'
        ]
      },
      categories: getNormalizedCategoriesFixture(2021),
      nominations: getNormalizedNominationsFixture([
        'nomination-2021-best-animated-short-1',
        'nomination-2021-best-animated-short-2',
        'nomination-2021-best-picture-1',
        'nomination-2021-best-picture-2'
      ]),
      films: {
        failsafe: {
          id: 'failsafe',
          imdbId: 'imdb-fs',
          name: 'Failsafe',
          poster: 'http://image.tmdb.org/t/p/w342/failsafe.jpg'
        },
        'twelve-angry-men': {
          id: 'twelve-angry-men',
          imdbId: 'imdb-tam',
          name: 'Twelve Angry Men',
          poster: 'http://image.tmdb.org/t/p/w342/twelve-angry-men.jpg'
        },
        'legally-blond': {
          id: 'legally-blond',
          imdbId: 'imdb-lb',
          name: 'Legally Blond',
          poster: 'http://image.tmdb.org/t/p/w342/legally-blond.jpg'
        },
        'legally-blond-2': {
          id: 'legally-blond-2',
          imdbId: 'imdb-lb2',
          name: 'Legally Blond 2',
          poster: 'http://image.tmdb.org/t/p/w342/legally-blond-2.jpg'
        }
      },
      meta: {
        completedCategories: 2
      }
    };

    expect(nominationData).toEqual(expectedNominationData);
  });
});
