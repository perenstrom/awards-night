import {
  Category,
  NominationBets,
  NormalizedBets,
  NormalizedNominations,
  Player
} from 'types/nominations';

export const addPlayersWinnings = (
  players: Player[],
  categories: Category[],
  nominations: NormalizedNominations,
  nominationBets: NominationBets,
  bets: NormalizedBets
): Player[] => {
  // Record<PlayerId, number>
  const playerWins: Record<number, number> = {};

  categories.forEach((category) => {
    category.nominations.forEach((n) => {
      if (nominations[n].won) {
        const winningBets = nominationBets?.[n] ?? [];
        winningBets.forEach((bet) => {
          playerWins[bets[bet].player] !== undefined
            ? playerWins[bets[bet].player]++
            : (playerWins[bets[bet].player] = 1);
        });
      }
    });
  });

  const newPlayers: Player[] = players.map((player) => ({
    ...player,
    correct: playerWins[player.id] || 0
  }));

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
