import {
  Category,
  NominationBets,
  NormalizedBets,
  NormalizedNominations,
  NormalizedPlayers
} from 'types/nominations';

export const addPlayersWinnings = (
  categories: Category[],
  nominations: NormalizedNominations,
  nominationBets: NominationBets,
  bets: NormalizedBets,
  normalizedPlayers: NormalizedPlayers
): NormalizedPlayers => {
  const newPlayers: NormalizedPlayers = {};
  (Object.keys(normalizedPlayers) as string[]).forEach((playerId) => {
    newPlayers[parseInt(playerId, 10)] = {
      ...normalizedPlayers[parseInt(playerId, 10)],
      correct: 0
    };
  });

  categories.forEach((category) => {
    category.nominations.forEach((n) => {
      if (nominations[n].won) {
        const winningBets = (nominationBets?.[n] ?? []);
        winningBets.forEach((bet) => {
          newPlayers[bets[bet].player].correct !== undefined
            ? newPlayers[bets[bet].player].correct++
            : (newPlayers[bets[bet].player].correct = 0);
        });
      }
    });
  });

  return newPlayers;
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
