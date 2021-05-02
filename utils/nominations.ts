import {
  Category,
  NormalizedBets,
  NormalizedNominations,
  NormalizedPlayers,
  Player,
  Status
} from 'types/nominations';

export const calculateWinnings = (
  categories: Category[],
  nominations: NormalizedNominations,
  bets: NormalizedBets,
  players: Player[]
): { players: NormalizedPlayers; status: Status } => {
  const newPlayers: NormalizedPlayers = {};
  players.forEach((p) => (newPlayers[p.id] = { ...p, correct: 0 }));

  categories.forEach((category) => {
    const categoryNominations = category.nominations;
    categoryNominations.forEach((n) => {
      if (nominations[n].won) {
        const winningBets = nominations[n].bets ?? [];
        winningBets.forEach((bet) => {
          newPlayers[bets[bet].player].correct++;
        });
      }
    });
  });

  return {
    players: newPlayers,
    status: {
      completedCategories: calculateCompletedCategories(categories, nominations)
    }
  };
};

export const calculateCompletedCategories = (
  categories: Category[],
  nominations: NormalizedNominations
) => {
  return categories.reduce(
    (sum, category) =>
      category.nominations.some((nominationId) => nominations[nominationId].won)
        ? (sum += 1)
        : sum,
    0
  );
};
