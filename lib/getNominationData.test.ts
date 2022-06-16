import type { Context } from 'services/prisma/prisma.types';
import { MockContext, createMockContext } from '__test__/__mocks__/prisma';
import { getCategoriesResponseFixture } from '__test__/__fixtures__/prisma/getCategoriesResponse';
import { getFilmsResponseFixture } from '__test__/__fixtures__/prisma/getFilmsResponse';
import { getNominationsResponseFixture } from '__test__/__fixtures__/prisma/getNominationsResponse';
import { getYearResponseFixture } from '__test__/__fixtures__/prisma/getYearsResponse';

import { getNominationData } from './getNominationData';

import type { NominationData } from 'types/nominations';

describe('getNominationData', () => {
  let mockCtx: MockContext;
  let ctx: Context;

  beforeEach(() => {
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as Context;
  });

  it('returns correct nomination data for a year, without bets (betting open)', async () => {
    mockCtx.prisma.year.findUnique.mockResolvedValue(
      getYearResponseFixture(2020)
    );
    mockCtx.prisma.category.findMany.mockResolvedValue(
      getCategoriesResponseFixture(2020)
    );
    mockCtx.prisma.nomination.findMany.mockResolvedValue(
      getNominationsResponseFixture(2020)
    );
    mockCtx.prisma.film.findMany.mockResolvedValue(
      getFilmsResponseFixture(2020)
    );

    const year = 2020;
    const nominationData = await getNominationData(year, ctx);

    const expectedNominationData: NominationData = {
      year: {
        name: '92nd Academy Awards',
        year: 2020,
        date: '2020-02-10T00:00:00.000Z',
        bettingOpen: true,
        categories: ['best-supporting-actor', 'best-hair-and-makeup'],
        nominations: [123, 124, 128, 129]
      },
      categories: {
        'best-hair-and-makeup': {
          slug: 'best-hair-and-makeup',
          name: 'Best Hair and Makeup',
          nextCategory: 'best-supporting-actor',
          previousCategory: null,
          nominations: [128, 129]
        },
        'best-supporting-actor': {
          slug: 'best-supporting-actor',
          name: 'Best Supporting Actor',
          nextCategory: null,
          previousCategory: 'best-hair-and-makeup',
          nominations: [123, 124]
        }
      },
      nominations: {
        123: {
          id: 123,
          year: 2020,
          category: 'best-supporting-actor',
          nominee: 'Tom Hanks',
          won: false,
          decided: false,
          film: 'tt3224458'
        },
        124: {
          id: 124,
          year: 2020,
          category: 'best-supporting-actor',
          nominee: 'Brad Pitt',
          won: false,
          decided: false,
          film: 'tt7131622'
        },
        128: {
          id: 128,
          year: 2020,
          category: 'best-hair-and-makeup',
          nominee: '',
          won: false,
          decided: false,
          film: 'tt8579674'
        },
        129: {
          id: 129,
          year: 2020,
          category: 'best-hair-and-makeup',
          nominee: '',
          won: false,
          decided: false,
          film: 'tt6394270'
        }
      },
      films: {
        tt3224458: {
          imdbId: 'tt3224458',
          name: 'A Beautiful Day in the Neighborhood',
          releaseDate: '',
          poster:
            'https://image.tmdb.org/t/p/w342/p9vCAVhDK375XyobVcKqzqzsUHE.jpg'
        },
        tt7131622: {
          imdbId: 'tt7131622',
          name: 'Once Upon a Time… in Hollywood',
          releaseDate: '',
          poster:
            'https://image.tmdb.org/t/p/w342/8j58iEBw9pOXFD2L0nt0ZXeHviB.jpg'
        },
        tt8579674: {
          imdbId: 'tt8579674',
          name: '1917',
          releaseDate: '',
          poster:
            'https://image.tmdb.org/t/p/w342/iZf0KyrE25z1sage4SYFLCCrMi9.jpg'
        },
        tt6394270: {
          imdbId: 'tt6394270',
          name: 'Bombshell',
          releaseDate: '',
          poster:
            'https://image.tmdb.org/t/p/w342/gbPfvwBqbiHpQkYZQvVwB6MVauV.jpg'
        }
      },
      meta: {
        completedCategories: 0
      }
    };

    expect(nominationData).toEqual(expectedNominationData);
  });

  it('returns correct nomination data for a year, with bets (betting closed)', async () => {
    mockCtx.prisma.year.findUnique.mockResolvedValue(
      getYearResponseFixture(2021)
    );
    mockCtx.prisma.category.findMany.mockResolvedValue(
      getCategoriesResponseFixture(2021)
    );
    mockCtx.prisma.nomination.findMany.mockResolvedValue(
      getNominationsResponseFixture(2021)
    );
    mockCtx.prisma.film.findMany.mockResolvedValue(
      getFilmsResponseFixture(2021)
    );

    const year = 2021;
    const nominationData = await getNominationData(year, ctx);

    const expectedNominationData: NominationData = {
      year: {
        name: '93rd Academy Awards',
        year: 2021,
        date: '2021-04-26T00:00:00.000Z',
        bettingOpen: false,
        categories: ['best-picture', 'best-supporting-actress'],
        nominations: [1, 4, 11, 12]
      },
      categories: {
        'best-picture': {
          slug: 'best-picture',
          name: 'Best Picture',
          previousCategory: null,
          nextCategory: 'best-supporting-actress',
          nominations: [1, 4]
        },
        'best-supporting-actress': {
          slug: 'best-supporting-actress',
          name: 'Best Supporting Actress',
          previousCategory: 'best-picture',
          nextCategory: null,
          nominations: [11, 12]
        }
      },
      nominations: {
        1: {
          id: 1,
          year: 2021,
          category: 'best-picture',
          nominee: '',
          won: true,
          decided: true,
          film: 'tt9770150'
        },
        4: {
          id: 4,
          year: 2021,
          category: 'best-picture',
          nominee: '',
          won: false,
          decided: true,
          film: 'tt10272386'
        },
        11: {
          id: 11,
          year: 2021,
          category: 'best-supporting-actress',
          nominee: 'Maria Bakalova',
          won: false,
          decided: true,
          film: 'tt13143964'
        },
        12: {
          id: 12,
          year: 2021,
          category: 'best-supporting-actress',
          nominee: 'Glenn Close',
          won: true,
          decided: true,
          film: 'tt6772802'
        }
      },
      films: {
        tt9770150: {
          imdbId: 'tt9770150',
          name: 'Nomadland',
          releaseDate: '',
          poster:
            'https://image.tmdb.org/t/p/w342/fmHBjfiMb7cP0cikF17LoA8E1bp.jpg'
        },
        tt10618286: {
          imdbId: 'tt10618286',
          name: 'Mank',
          releaseDate: '',
          poster:
            'https://image.tmdb.org/t/p/w342/1VF9IcI4Vyrd2oYrVp0oNuPeE70.jpg'
        },
        tt13143964: {
          imdbId: 'tt13143964',
          name: 'Borat Subsequent Moviefilm',
          releaseDate: '',
          poster:
            'https://image.tmdb.org/t/p/w342/kwh9dYvZLn7yJ9nfU5sPj2h9O7l.jpg'
        },
        tt10706602: {
          imdbId: 'tt10706602',
          name: 'Collective',
          releaseDate: '',
          poster:
            'https://image.tmdb.org/t/p/w342/oR93n0CAn2GznyHDFSRTp0J1t8c.jpg'
        }
      },
      meta: {
        completedCategories: 2
      }
    };

    expect(nominationData).toEqual(expectedNominationData);
  });
});
