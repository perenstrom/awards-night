import { getBets, getNominations, getPlayers } from 'services/airtable';
import {
  BettingData,
  NormalizedBets,
  NormalizedCategories,
  NormalizedNominations,
  NormalizedPlayers,
  Year
} from 'types/nominations';
import { addPlayersWinnings } from 'utils/nominations';

export const getBettingData = async (
  year: Year,
  categories: NormalizedCategories,
  nominations: NormalizedNominations
): Promise<BettingData> => {
  const nominationsWithBets = await getNominations(year.nominations);
  const bets = await getBets(nominationsWithBets.map((n) => n.bets).flat());
  const betIds = bets.map((bet) => bet.id);

  const normalizedBets: NormalizedBets = {};
  if (!year.bettingOpen) {
    bets.forEach((b) => {
      normalizedBets[b.id] = b;
    });
  }

  const players = await getPlayers(bets.map((b) => b.player));
  const rawNormalizedPlayers: NormalizedPlayers = {};
  players.forEach((player) => {
    rawNormalizedPlayers[player.id] = {
      ...player,
      bets: !year.bettingOpen
        ? player.bets.filter((betId) => betIds.includes(betId))
        : []
    };
  });

  let normalizedPlayers: NormalizedPlayers = rawNormalizedPlayers;
  if (!year.bettingOpen) {
    normalizedPlayers = addPlayersWinnings(
      Object.values(categories),
      nominations,
      normalizedBets,
      rawNormalizedPlayers
    );
  }

  return {
    bets: normalizedBets,
    players: normalizedPlayers
  };
};
