import { atom, selector } from 'recoil';
import {
  Category,
  NormalizedBets,
  NormalizedCategories,
  NormalizedNominations,
  NormalizedPlayers,
  NominationMeta,
  NominationBets,
  Player,
  Bet,
  Nomination
} from 'types/nominations';
import { Nullable } from 'types/utilityTypes';
import {
  calculateCompletedCategories,
  addPlayersWinnings
} from 'utils/nominations';
import {
  normalizeBets,
  normalizeCategories,
  normalizeNominations,
  normalizePlayers
} from 'utils/normalizer';

// Bets
export const betsState = atom<Bet[]>({
  key: 'betsState',
  default: []
});

export const normalizedBetsState = selector<Nullable<NormalizedBets>>({
  key: 'normalizedBetsState',
  get: ({ get }) => normalizeBets(get(betsState))
});

// Nominations
export const nominationsState = atom<Nomination[]>({
  key: 'nominationsState',
  default: []
});

export const normalizedNominationsState = selector<
  Nullable<NormalizedNominations>
>({
  key: 'normalizedNominationsState',
  get: ({ get }) => {
    const nominations = get(nominationsState);
    //debugger;
    return normalizeNominations(nominations);
  }
});

// Nomination bets
export const nominationBetsState = atom<Nullable<NominationBets>>({
  key: 'nominationBetsState',
  default: null
});

// Categories
export const categoriesState = atom<Category[]>({
  key: 'categoriesState',
  default: []
});

export const normalizedCategoriesState = selector<
  Nullable<NormalizedCategories>
>({
  key: 'normalizedCategoriesState',
  get: ({ get }) => normalizeCategories(get(categoriesState))
});

// Meta
export const metaState = selector<NominationMeta>({
  key: 'metaState',
  get: ({ get }) => {
    const categories = get(categoriesState);
    const nominations = get(normalizedNominationsState);

    if (categories.length === 0 || !nominations) {
      return {
        completedCategories: 0
      };
    }

    const completedCategories = calculateCompletedCategories(
      categories,
      nominations
    );

    return {
      completedCategories: completedCategories
    };
  }
});

// Players
const rawPlayersState = atom<Player[]>({
  key: 'rawPlayersState',
  default: [],
  dangerouslyAllowMutability: true
});

export const playerState = selector<Player[]>({
  key: 'playersState',
  get: ({ get }) => {
    const players = get(rawPlayersState);
    const nominations = get(normalizedNominationsState);
    const bets = get(betsState);

    if (players && nominations) {
      const playersWithWins = addPlayersWinnings(
        (Object.entries(players) as [string, Player][]).map((c) => c[1]),
        nominations,
        (Object.entries(bets) as [string, Bet][]).map((c) => c[1])
      );

      return playersWithWins.sort((a, b) => b.correct - a.correct);
    } else {
      return players;
    }
  },
  set: ({ set }, newValue) => {
    set(rawPlayersState, newValue);
  }
});

export const normalizedPlayersState = selector<Nullable<NormalizedPlayers>>({
  key: 'normalizedPlayersState',
  get: ({ get }) => normalizePlayers(get(playerState))
});
