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
) => {
  const newPlayers: NormalizedPlayers = {};
  players.forEach((p) => (newPlayers[p.id] = { ...p, correct: 0 }));

  const status: Status = {
    completedCategories: 0
  };

  categories.forEach((category) => {
    const categoryNominations = category.nominations;
    categoryNominations.forEach((n) => {
      if (nominations[n].won) {
        status.completedCategories++;
        const winningBets = nominations[n].bets ?? [];
        winningBets.forEach((bet) => {
          newPlayers[bets[bet].player].correct++;
        });
      }
    });
  });

  return {
    players: newPlayers,
    status: status
  };
};
