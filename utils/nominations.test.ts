import {
  Category,
  NominationBets,
  NormalizedBets,
  NormalizedNominations,
  NormalizedPlayers,
  Player
} from 'types/nominations';
import {
  calculateCompletedCategories,
  addPlayersWinnings
} from './nominations';

const categories: Category[] = [
  {
    slug: 'cat-a',
    name: 'cat a',
    nominations: [1, 2],
    nextCategory: 'cat-b',
    previousCategory: null
  },
  {
    name: 'cat b',
    nominations: [3, 4],
    slug: 'cat-b',
    nextCategory: 'cat-c',
    previousCategory: 'cat-a'
  },
  {
    name: 'cat c',
    nominations: [5, 6],
    slug: 'cat-c',
    previousCategory: 'cat-b',
    nextCategory: null
  }
];

const nominations: NormalizedNominations = {
  // Cat a
  1: {
    category: 'a',
    film: 'a',
    id: 1,
    nominee: '',
    won: true,
    year: 2021,
    decided: true
  },
  2: {
    category: 'a',
    film: 'b',
    id: 2,
    nominee: '',
    won: false,
    year: 2021,
    decided: true
  },
  // Cat b
  3: {
    category: 'b',
    film: 'c',
    id: 3,
    nominee: '',
    won: false,
    year: 2021,
    decided: true
  },
  4: {
    category: 'b',
    film: 'd',
    id: 4,
    nominee: '',
    won: true,
    year: 2021,
    decided: true
  },
  // Cat c
  5: {
    category: 'c',
    film: 'e',
    id: 5,
    nominee: '',
    won: false,
    year: 2021,
    decided: true
  },
  6: {
    category: 'c',
    film: 'f',
    id: 6,
    nominee: '',
    won: false,
    year: 2021,
    decided: true
  }
};

const nominationBets: NominationBets = {
  1: [1, 2],
  2: [],
  3: [3],
  4: [4],
  5: [],
  6: []
};

const players: Player[] = [
  {
    id: 1,
    bets: [1, 3],
    correct: 0,
    name: 'Player A',
    group: 1
  },
  {
    id: 2,
    bets: [2, 4],
    correct: 0,
    name: 'Player B',
    group: 1
  }
];

const bets: NormalizedBets = {
  1: {
    id: 1,
    nomination: 1,
    player: 1
  },
  2: {
    id: 2,
    nomination: 1,
    player: 2
  },
  3: {
    id: 3,
    nomination: 3,
    player: 1
  },
  4: {
    id: 4,
    nomination: 4,
    player: 2
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
    const expectedPlayers: NormalizedPlayers = [
      {
        id: 1,
        bets: [1, 3],
        correct: 1,
        name: 'Player A',
        group: 1
      },
      {
        id: 2,
        bets: [2, 4],
        correct: 2,
        name: 'Player B',
        group: 1
      }
    ];

    const enhancedPlayers: NormalizedPlayers = addPlayersWinnings(
      players,
      categories,
      nominations,
      nominationBets,
      bets
    );
    expect(enhancedPlayers).toEqual(expectedPlayers);
  });
});
