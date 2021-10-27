import { NormalizedNominations } from 'types/nominations';

export const getNormalizedNominationsFixture = (
  nominations?: string[]
): NormalizedNominations => {
  const nominationsFixture: NormalizedNominations = {
    'nomination-2020-best-adapted-screenplay-1': {
      bets: [],
      category: 'best-adapted-screenplay-id',
      decided: false,
      film: 'citizen-kane',
      id: 'nomination-2020-best-adapted-screenplay-1',
      nominee: null,
      won: false,
      year: '2020-id'
    },
    'nomination-2020-best-adapted-screenplay-2': {
      bets: [],
      category: 'best-adapted-screenplay-id',
      decided: false,
      film: 'moana',
      id: 'nomination-2020-best-adapted-screenplay-2',
      nominee: null,
      won: false,
      year: '2020-id'
    },
    'nomination-2020-best-picture-1': {
      bets: [],
      category: 'best-picture-id',
      decided: false,
      film: 'the-matrix',
      id: 'nomination-2020-best-picture-1',
      nominee: null,
      won: false,
      year: '2020-id'
    },
    'nomination-2020-best-picture-2': {
      bets: [],
      category: 'best-picture-id',
      decided: false,
      film: 'bridget-jones',
      id: 'nomination-2020-best-picture-2',
      nominee: null,
      won: false,
      year: '2020-id'
    },
    'nomination-2021-best-animated-short-1': {
      bets: ['bet-3'],
      category: 'best-animated-short-id',
      decided: false,
      film: 'failsafe',
      id: 'nomination-2021-best-animated-short-1',
      nominee: null,
      won: false,
      year: '2021-id'
    },
    'nomination-2021-best-animated-short-2': {
      bets: ['bet-4'],
      category: 'best-animated-short-id',
      decided: false,
      film: 'twelve-angry-men',
      id: 'nomination-2021-best-animated-short-2',
      nominee: null,
      won: true,
      year: '2021-id'
    },
    'nomination-2021-best-picture-1': {
      bets: ['bet-5', 'bet-6'],
      category: 'best-picture-id',
      decided: false,
      film: 'legally-blond',
      id: 'nomination-2021-best-picture-1',
      nominee: 'Vanessa Kirby',
      won: true,
      year: '2021-id'
    },
    'nomination-2021-best-picture-2': {
      bets: [],
      category: 'best-picture-id',
      decided: false,
      film: 'legally-blond-2',
      id: 'nomination-2021-best-picture-2',
      nominee: 'Vanessa Kirby',
      won: false,
      year: '2021-id'
    }
  };

  if (nominations) {
    return Object.keys(nominationsFixture)
      .filter((key) => nominations.includes(key))
      .reduce((obj, key) => {
        return {
          ...obj,
          [key]: nominationsFixture[key]
        };
      }, {}) as NormalizedNominations;
  } else {
    return nominationsFixture;
  }
};
