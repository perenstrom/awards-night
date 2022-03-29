import { CategoryId, NominationId, Year, YearId } from 'types/nominations';

export const getYearFixture = (year: number): Year => {
  const yearFixture = {
    2020: {
      id: '2020-id' as YearId,
      name: '92rd Academy Awards',
      year: 2020,
      date: new Date('2020-04-25T22:00:00.000Z').toDateString(),
      bettingOpen: true,
      categories: [
        'best-adapted-screenplay-id' as CategoryId,
        'best-picture-id' as CategoryId
      ],
      nominations: [
        'nomination-2020-best-adapted-screenplay-1' as NominationId,
        'nomination-2020-best-adapted-screenplay-2' as NominationId,
        'nomination-2020-best-picture-1' as NominationId,
        'nomination-2020-best-picture-2' as NominationId
      ]
    },
    2021: {
      id: '2021-id' as YearId,
      name: '93rd Academy Awards',
      year: 2021,
      date: new Date('2021-04-25T22:00:00.000Z').toDateString(),
      bettingOpen: false,
      categories: [
        'best-animated-short-id' as CategoryId,
        'best-picture-id' as CategoryId
      ],
      nominations: [
        'nomination-2021-best-animated-short-1' as NominationId,
        'nomination-2021-best-animated-short-2' as NominationId,
        'nomination-2021-best-picture-1' as NominationId,
        'nomination-2021-best-picture-2' as NominationId
      ]
    }
  };

  if (Object.keys(yearFixture).includes(year.toString())) {
    return yearFixture[year.toString() as unknown as keyof typeof yearFixture];
  } else {
    throw new Error('Year not in fixture');
  }
};
