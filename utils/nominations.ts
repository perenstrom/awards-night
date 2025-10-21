import {
  Bet,
  Category,
  NormalizedNominations,
  Player
} from 'types/nominations';
import { NumberRecord } from 'types/utilityTypes';

export const addPlayersWinnings = (
  players: Player[],
  nominations: NormalizedNominations,
  bets: Bet[]
): Player[] => {
  // Record<PlayerId, number>
  const playerWins: NumberRecord<number> = {};

  bets.forEach((bet) => {
    if (nominations[bet.nomination].won) {
      if (playerWins[bet.player]) {
        playerWins[bet.player] += 1;
      } else {
        playerWins[bet.player] = 1;
      }
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

export const getBetForNomination = (bets: Bet[], nominationId: number) => {
  const filteredBets = bets.filter((bet) => bet.nomination === nominationId);

  if (filteredBets.length > 1) {
    throw new Error('More than one bet for the requested nomination');
  } else if (filteredBets.length === 0) {
    return null;
  } else {
    return filteredBets[0];
  }
};
