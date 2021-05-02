import { assert } from 'console';
import {
  Category,
  CategoryId,
  FilmId,
  Nomination,
  NominationId,
  NormalizedCategories,
  NormalizedNominations
} from 'types/nominations';
import { calculateCompletedCategories } from './nominations';

const categories: Category[] = [
  {
    id: 'a' as CategoryId,
    name: 'cat a',
    nextCategory: 'cat-b',
    nominations: ['noma' as NominationId, 'nomb' as NominationId],
    previousCategory: null,
    slug: 'cat-a'
  },
  {
    id: 'b' as CategoryId,
    name: 'cat b',
    nextCategory: 'cat-c',
    nominations: ['nomc' as NominationId, 'nomd' as NominationId],
    previousCategory: 'cat-a',
    slug: 'cat-b'
  },
  {
    id: 'c' as CategoryId,
    name: 'cat c',
    nextCategory: null,
    nominations: ['nome' as NominationId, 'nomf' as NominationId],
    previousCategory: 'cat-b',
    slug: 'cat-c'
  }
];

const nominations: NormalizedNominations = {
  noma: {
    bets: [],
    category: 'a' as CategoryId,
    decided: null,
    film: 'a' as FilmId,
    id: 'noma' as NominationId,
    nominee: '',
    won: true,
    year: 2021
  },
  nomb: {
    bets: [],
    category: 'a' as CategoryId,
    decided: null,
    film: 'b' as FilmId,
    id: 'nomb' as NominationId,
    nominee: '',
    won: false,
    year: 2021
  },
  nomc: {
    bets: [],
    category: 'b' as CategoryId,
    decided: null,
    film: 'c' as FilmId,
    id: 'nomc' as NominationId,
    nominee: '',
    won: false,
    year: 2021
  },
  nomd: {
    bets: [],
    category: 'b' as CategoryId,
    decided: null,
    film: 'd' as FilmId,
    id: 'nomd' as NominationId,
    nominee: '',
    won: true,
    year: 2021
  },
  nome: {
    bets: [],
    category: 'c' as CategoryId,
    decided: null,
    film: 'e' as FilmId,
    id: 'nome' as NominationId,
    nominee: '',
    won: false,
    year: 2021
  },
  nomf: {
    bets: [],
    category: 'c' as CategoryId,
    decided: null,
    film: 'f' as FilmId,
    id: 'nomf' as NominationId,
    nominee: '',
    won: false,
    year: 2021
  }
};

describe('calculateCompletedCategories', () => {
  it('returns correct number of completed categories', async () => {
    const completedCategories = calculateCompletedCategories(
      categories,
      nominations
    );
    expect(completedCategories).toEqual(2);
  });
});
