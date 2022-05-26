import {
  Bet,
  Category,
  NormalizedNominations,
  Player
} from 'types/nominations';

export const addPlayersWinnings = (
  players: Player[],
  nominations: NormalizedNominations,
  bets: Bet[]
): Player[] => {
  // Record<PlayerId, number>
  const playerWins: Record<number, number> = {};

  bets.forEach((bet) => {
    if (nominations[bet.nomination].won) {
      playerWins[bet.player]
        ? (playerWins[bet.player] += 1)
        : (playerWins[bet.player] = 1);
    }
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
