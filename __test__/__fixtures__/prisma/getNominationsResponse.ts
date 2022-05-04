import { Nomination } from '@prisma/client';

export const getNominationsResponseFixture = (year: number): Nomination[] => {
  const nominations: Record<number, Nomination[]> = {
    2020: [
      {
        id: 123,
        yearId: 2020,
        categoryId: 'best-supporting-actor',
        nominee: 'Tom Hanks',
        won: false,
        decided: false,
        filmId: 'tt3224458'
      },
      {
        id: 124,
        yearId: 2020,
        categoryId: 'best-supporting-actor',
        nominee: 'Brad Pitt',
        won: false,
        decided: false,
        filmId: 'tt7131622'
      },
      {
        id: 128,
        yearId: 2020,
        categoryId: 'best-hair-and-makeup',
        nominee: null,
        won: false,
        decided: false,
        filmId: 'tt8579674'
      },
      {
        id: 129,
        yearId: 2020,
        categoryId: 'best-hair-and-makeup',
        nominee: null,
        won: false,
        decided: false,
        filmId: 'tt6394270'
      }
    ],
    2021: [
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
        won: true,
        decided: true,
        filmId: 'tt6772802'
      }
    ]
  };

  return nominations[year];
};
