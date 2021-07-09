import {
  BetId,
  Category,
  CategoryId,
  FilmId,
  NominationId,
  NormalizedBets,
  NormalizedNominations,
  NormalizedPlayers,
  PlayerId
} from 'types/nominations';
import {
  calculateCompletedCategories,
  addPlayersWinnings
} from './nominations';

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
  // Cat a
  noma: {
    bets: ['bet-a', 'bet-b'],
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
  // Cat b
  nomc: {
    bets: ['bet-c'],
    category: 'b' as CategoryId,
    decided: null,
    film: 'c' as FilmId,
    id: 'nomc' as NominationId,
    nominee: '',
    won: false,
    year: 2021
  },
  nomd: {
    bets: ['bet-d'],
    category: 'b' as CategoryId,
    decided: null,
    film: 'd' as FilmId,
    id: 'nomd' as NominationId,
    nominee: '',
    won: true,
    year: 2021
  },
  // Cat c
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

const players: NormalizedPlayers = {
  'player-a': {
    id: 'player-a' as PlayerId,
    bets: ['bet-a', 'bet-c'],
    correct: 0,
    name: 'Player A'
  },
  'player-b': {
    id: 'player-b' as PlayerId,
    bets: ['bet-b', 'bet-d'],
    correct: 0,
    name: 'Player B'
  }
};

const bets: NormalizedBets = {
  'bet-a': {
    id: 'bet-a' as BetId,
    nomination: 'noma' as NominationId,
    player: 'player-a' as PlayerId
  },
  'bet-b': {
    id: 'bet-b' as BetId,
    nomination: 'noma' as NominationId,
    player: 'player-b' as PlayerId
  },
  'bet-c': {
    id: 'bet-c' as BetId,
    nomination: 'nomc' as NominationId,
    player: 'player-a' as PlayerId
  },
  'bet-d': {
    id: 'bet-d' as BetId,
    nomination: 'nomd' as NominationId,
    player: 'player-b' as PlayerId
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

describe('calculatePlayerWinnings', () => {
  it('returns the expected players object', async () => {
    const expectedPlayers: NormalizedPlayers = {
      'player-a': {
        id: 'player-a' as PlayerId,
        bets: ['bet-a', 'bet-c'],
        correct: 1,
        name: 'Player A'
      },
      'player-b': {
        id: 'player-b' as PlayerId,
        bets: ['bet-b', 'bet-d'],
        correct: 2,
        name: 'Player B'
      }
    };

    const enhancedPlayers: NormalizedPlayers = addPlayersWinnings(
      categories,
      nominations,
      bets,
      players
    );
    expect(enhancedPlayers).toEqual(expectedPlayers);
  });
});
