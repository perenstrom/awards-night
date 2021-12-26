import {
  BetId,
  Category,
  CategoryId,
  FilmId,
  GroupId,
  NominationBets,
  NominationId,
  NormalizedBets,
  NormalizedNominations,
  NormalizedPlayers,
  PlayerId,
  YearId
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
  ['noma' as NominationId]: {
    category: 'a' as CategoryId,
    decided: null,
    film: 'a' as FilmId,
    id: 'noma' as NominationId,
    nominee: '',
    won: true,
    year: '2021' as YearId
  },
  ['nomb' as NominationId]: {
    category: 'a' as CategoryId,
    decided: null,
    film: 'b' as FilmId,
    id: 'nomb' as NominationId,
    nominee: '',
    won: false,
    year: '2021' as YearId
  },
  // Cat b
  ['nomc' as NominationId]: {
    category: 'b' as CategoryId,
    decided: null,
    film: 'c' as FilmId,
    id: 'nomc' as NominationId,
    nominee: '',
    won: false,
    year: '2021' as YearId
  },
  ['nomd' as NominationId]: {
    category: 'b' as CategoryId,
    decided: null,
    film: 'd' as FilmId,
    id: 'nomd' as NominationId,
    nominee: '',
    won: true,
    year: '2021' as YearId
  },
  // Cat c
  ['nome' as NominationId]: {
    category: 'c' as CategoryId,
    decided: null,
    film: 'e' as FilmId,
    id: 'nome' as NominationId,
    nominee: '',
    won: false,
    year: '2021' as YearId
  },
  ['nomf' as NominationId]: {
    category: 'c' as CategoryId,
    decided: null,
    film: 'f' as FilmId,
    id: 'nomf' as NominationId,
    nominee: '',
    won: false,
    year: '2021' as YearId
  }
};

const nominationBets: NominationBets = {
  ['noma' as NominationId]: ['bet-a' as BetId, 'bet-b' as BetId],
  ['nomb' as NominationId]: [],
  ['nomc' as NominationId]: ['bet-c' as BetId],
  ['nomd' as NominationId]: ['bet-d' as BetId],
  ['nome' as NominationId]: [],
  ['nomf' as NominationId]: []
};

const players: NormalizedPlayers = {
  ['player-a' as PlayerId]: {
    id: 'player-a' as PlayerId,
    bets: ['bet-a' as BetId, 'bet-c' as BetId],
    correct: 0,
    name: 'Player A',
    group: 'group-1' as GroupId
  },
  ['player-b' as PlayerId]: {
    id: 'player-b' as PlayerId,
    bets: ['bet-b' as BetId, 'bet-d' as BetId],
    correct: 0,
    name: 'Player B',
    group: 'group-1' as GroupId
  }
};

const bets: NormalizedBets = {
  ['bet-a' as BetId]: {
    id: 'bet-a' as BetId,
    nomination: 'noma' as NominationId,
    player: 'player-a' as PlayerId
  },
  ['bet-b' as BetId]: {
    id: 'bet-b' as BetId,
    nomination: 'noma' as NominationId,
    player: 'player-b' as PlayerId
  },
  ['bet-c' as BetId]: {
    id: 'bet-c' as BetId,
    nomination: 'nomc' as NominationId,
    player: 'player-a' as PlayerId
  },
  ['bet-d' as BetId]: {
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
      ['player-a' as PlayerId]: {
        id: 'player-a' as PlayerId,
        bets: ['bet-a' as BetId, 'bet-c' as BetId],
        correct: 1,
        name: 'Player A',
        group: 'group-1' as GroupId
      },
      ['player-b' as PlayerId]: {
        id: 'player-b' as PlayerId,
        bets: ['bet-b' as BetId, 'bet-d' as BetId],
        correct: 2,
        name: 'Player B',
        group: 'group-1' as GroupId
      }
    };

    const enhancedPlayers: NormalizedPlayers = addPlayersWinnings(
      categories,
      nominations,
      nominationBets,
      bets,
      players
    );
    expect(enhancedPlayers).toEqual(expectedPlayers);
  });
});
