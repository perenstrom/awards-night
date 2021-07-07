import { getBets, getPlayers } from 'services/airtable';
import {
  BettingData,
  Nomination,
  NormalizedBets,
  NormalizedNominations,
  NormalizedPlayers,
  Year
} from 'types/nominations';

export const getBettingData = async (
  year: Year,
  nominations: NormalizedNominations
): Promise<BettingData> => {
  const bets = await getBets(
    (Object.values(nominations) as Nomination[]).map((n) => n.bets).flat()
  );

  const normalizedBets: NormalizedBets = {};
  if (!year.bettingOpen) {
    bets.forEach((b) => {
      normalizedBets[b.id] = b;
      (nominations[b.nomination] as Nomination).bets.push(b.id);
    });
  }

  let normalizedPlayers: NormalizedPlayers = {};
/*   if (!year.bettingOpen && bets.length > 0) {
    const players = await getPlayers(bets.map((b) => b.player));

    const rawNormalizedPlayers: NormalizedPlayers = {};
    players.forEach((player) => {
      rawNormalizedPlayers[player.id] = player;
    });
    normalizedPlayers = rawNormalizedPlayers;
  } */

  return {
    bets: normalizedBets,
    players: {}
  };
};
