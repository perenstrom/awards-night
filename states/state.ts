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
  Bet
} from 'types/nominations';
import {
  calculateCompletedCategories,
  addPlayersWinnings
} from 'utils/nominations';

export const betsState = atom<NormalizedBets>({
  key: 'betsState',
  default: {}
});

export const nominationsState = atom<NormalizedNominations>({
  key: 'nominationsState',
  default: {}
});

export const nominationBetsState = atom<NominationBets>({
  key: 'nominationBetsState',
  default: {}
});

export const normalizedCategoriesState = atom<NormalizedCategories>({
  key: 'normalizedCategoriesState',
  default: {}
});

export const categoriesState = selector<Category[]>({
  key: 'categoriesState',
  get: ({ get }) => {
    const normalizedCategories = get(normalizedCategoriesState);
    return normalizedCategories
      ? (Object.entries(normalizedCategories) as [string, Category][]).map(
          (c) => c[1]
        )
      : [];
  }
});

export const metaState = selector<NominationMeta>({
  key: 'metaState',
  get: ({ get }) => {
    const categories = get(categoriesState);
    const nominations = get(nominationsState);
    const completedCategories = calculateCompletedCategories(
      categories,
      nominations
    );

    if (categories.length === 0) {
      return {
        completedCategories: 0
      };
    } else {
      return {
        completedCategories: completedCategories
      };
    }
  }
});

const rawPlayersState = atom<NormalizedPlayers>({
  key: 'rawPlayersState',
  default: {},
  dangerouslyAllowMutability: true
});

export const playerState = selector<NormalizedPlayers>({
  key: 'normalizedPlayersState',
  get: ({ get }) => {
    const players = get(rawPlayersState);
    const nominations = get(nominationsState);
    const bets = get(betsState);

    if (players) {
      return addPlayersWinnings(
        (Object.entries(players) as [string, Player][]).map((c) => c[1]),
        nominations,
        (Object.entries(bets) as [string, Bet][]).map((c) => c[1])
      );
    } else {
      return players;
    }
  },
  set: ({ set }, newValue) => {
    set(rawPlayersState, newValue);
  }
});
