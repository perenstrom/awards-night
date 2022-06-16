import { YearWithNominationsAndCategories } from 'services/prisma/prisma.types';

export const getYearResponseFixture = (
  year: number
): YearWithNominationsAndCategories => {
  const years: Record<number, YearWithNominationsAndCategories> = {
    2020: {
      year: 2020,
      name: '92nd Academy Awards',
      date: new Date('2020-02-10T00:00:00.000Z'),
      bettingOpen: true,
      nominations: [
        {
          id: 123,
          yearId: 2020,
          categoryId: 'best-supporting-actor',
          nominee: 'Tom Hanks',
          won: false,
          decided: true,
          filmId: 'tt3224458'
        },
        {
          id: 124,
          yearId: 2020,
          categoryId: 'best-supporting-actor',
          nominee: 'Brad Pitt',
          won: true,
          decided: true,
          filmId: 'tt7131622'
        },
        {
          id: 128,
          yearId: 2020,
          categoryId: 'best-hair-and-makeup',
          nominee: null,
          won: false,
          decided: true,
          filmId: 'tt8579674'
        },
        {
          id: 129,
          yearId: 2020,
          categoryId: 'best-hair-and-makeup',
          nominee: null,
          won: true,
          decided: true,
          filmId: 'tt6394270'
        }
      ],
      yearsCategories: [
        {
          categoryId: 'best-supporting-actor',
          yearId: 2020
        },
        {
          categoryId: 'best-hair-and-makeup',
          yearId: 2020
        }
      ]
    },
    2021: {
      year: 2021,
      name: '93rd Academy Awards',
      date: new Date('2021-04-26T00:00:00.000Z'),
      bettingOpen: false,
      nominations: [
        {
          id: 1,
          yearId: 2021,
          categoryId: 'best-picture',
          nominee: null,
          won: true,
          decided: true,
          filmId: 'tt9770150'
        },
        {
          id: 4,
          yearId: 2021,
          categoryId: 'best-picture',
          nominee: null,
          won: false,
          decided: true,
          filmId: 'tt10272386'
        },
        {
          id: 11,
          yearId: 2021,
          categoryId: 'best-supporting-actress',
          nominee: 'Maria Bakalova',
          won: false,
          decided: true,
          filmId: 'tt13143964'
        },
        {
          id: 12,
          yearId: 2021,
          categoryId: 'best-supporting-actress',
          nominee: 'Glenn Close',
          won: false,
          decided: true,
          filmId: 'tt6772802'
        }
      ],
      yearsCategories: [
        {
          categoryId: 'best-picture',
          yearId: 2021
        },
        {
          categoryId: 'best-supporting-actress',
          yearId: 2021
        }
      ]
    }
  };
  return years[year];
};
