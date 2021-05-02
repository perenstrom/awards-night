import { atom, selector } from 'recoil';
import {
  BetId,
  Category,
  CategoryId,
  NormalizedBets,
  NormalizedCategories,
  NormalizedNominations,
  NormalizedPlayers,
  Status
} from 'types/nominations';
import { calculateCompletedCategories } from 'utils/nominations';

export const betsState = atom<NormalizedBets>({
  key: 'betsState',
  default: null
});

export const nominationsState = atom<NormalizedNominations>({
  key: 'nominationsState',
  default: null
});

export const normalizedCategoriesState = atom<NormalizedCategories>({
  key: 'normalizedCategoriesState',
  default: null
});

export const categoriesState = selector<Category[]>({
  key: 'categoriesState',
  get: ({ get }) => {
    const normalizedCategories = get(normalizedCategoriesState);
    return normalizedCategories
      ? (Object.entries(normalizedCategories) as [CategoryId, Category][]).map(
          (c) => c[1]
        )
      : [];
  }
});

export const statusState = selector<Status>({
  key: 'statusState',
  get: ({ get }) => {
    const categories = get(categoriesState);
    const nominations = get(nominationsState);
    const completedCategories = calculateCompletedCategories(
      categories,
      nominations
    );

    return {
      completedCategories: completedCategories
    };
  }
});

const rawPlayersState = atom<NormalizedPlayers>({
  key: 'rawPlayersState',
  default: null
});

export const playerState = selector<NormalizedPlayers>({
  key: 'normalizedPlayersState',
  get: ({ get }) => {
    const normalizedPlayersState = get(rawPlayersState);
    const categories = get(categoriesState);
    const nominations = get(nominationsState);
    const bets = get(betsState);

    const newPlayers: NormalizedPlayers = {};
    categories.forEach((category) => {
      category.nominations.forEach((n) => {
        if (nominations[n].won) {
          const winningBets = (nominations[n].bets ?? []) as BetId[];
          winningBets.forEach((bet) => {
            newPlayers[bets[bet].player].correct
              ? newPlayers[bets[bet].player].correct++
              : (newPlayers[bets[bet].player].correct = 0);
          });
        }
      });
    });

    return newPlayers;
  },
  set: ({ set }, newValue) => {
    set(rawPlayersState, newValue);
  }
});
