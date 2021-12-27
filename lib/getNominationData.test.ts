import { YearId } from 'types/nominations';

import { mockRequests } from '__test__/test-utils';
import { getNormalizedCategoriesFixture } from '__test__/__fixtures__/getNormalizedCategoriesFixture';
import { getNormalizedNominationsFixture } from '__test__/__fixtures__/getNormalizedNominationsFixture';

import { getNominationData } from './getNominationData';

describe('getNominationData', () => {
  mockRequests();

  it('returns correct nomination data for a year, without bets (betting open)', async () => {
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
          poster: 'http://image.tmdb.org/t/p/w342/citizen-kane.jpg',
          releaseDate: '1941-05-01'
        },
        moana: {
          id: 'moana',
          imdbId: 'imdb-m',
          name: 'Moana',
          poster: 'http://image.tmdb.org/t/p/w342/moana.jpg',
          releaseDate: '2016-11-14'
        },
        'the-matrix': {
          id: 'the-matrix',
          imdbId: 'imdb-tm',
          name: 'The Matrix',
          poster: 'http://image.tmdb.org/t/p/w342/the-matrix.jpg',
          releaseDate: '1999-03-24'
        },
        'bridget-jones': {
          id: 'bridget-jones',
          imdbId: 'imdb-bj',
          name: 'Bridget Jones',
          poster: 'http://image.tmdb.org/t/p/w342/bridget-jones.jpg',
          releaseDate: '2001-04-04'
        }
      },
      meta: {
        completedCategories: 0
      }
    };

    expect(nominationData).toEqual(expectedNominationData);
  });

  it('returns correct nomination data for a year, with bets (betting closed)', async () => {
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
          poster: 'http://image.tmdb.org/t/p/w342/failsafe.jpg',
          releaseDate: '1964-09-15'
        },
        'twelve-angry-men': {
          id: 'twelve-angry-men',
          imdbId: 'imdb-tam',
          name: 'Twelve Angry Men',
          poster: 'http://image.tmdb.org/t/p/w342/twelve-angry-men.jpg',
          releaseDate: '1957-04-10'
        },
        'legally-blond': {
          id: 'legally-blond',
          imdbId: 'imdb-lb',
          name: 'Legally Blond',
          poster: 'http://image.tmdb.org/t/p/w342/legally-blond.jpg',
          releaseDate: '2001-06-26'
        },
        'legally-blond-2': {
          id: 'legally-blond-2',
          imdbId: 'imdb-lb2',
          name: 'Legally Blond 2',
          poster: 'http://image.tmdb.org/t/p/w342/legally-blond-2.jpg',
          releaseDate: '2003-06-30'
        }
      },
      meta: {
        completedCategories: 2
      }
    };

    expect(nominationData).toEqual(expectedNominationData);
  });
});
