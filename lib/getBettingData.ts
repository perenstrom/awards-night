import { getBets, getNominations, getPlayers } from 'services/airtable';
import {
  BettingData,
  GroupId,
  Nomination,
  NormalizedBets,
  NormalizedCategories,
  NormalizedNominations,
  NormalizedPlayers,
  Player,
  Year
} from 'types/nominations';
import { addPlayersWinnings } from 'utils/nominations';

export const getBettingData = async (
  year: Year,
  categories: NormalizedCategories,
  group: GroupId
): Promise<BettingData> => {
  const nominationsWithBets = await getNominations(year.nominations);
  const bets = await getBets(nominationsWithBets.map((n) => n.bets).flat());
  const players = await getPlayers(bets.map((b) => b.player));
  
  const playersInGroup = players.filter((p) => p.group === group);
  const playerIds = playersInGroup.map((p) => p.id);
  
  const betsInGroup = bets.filter((b) => playerIds.includes(b.player));
  const betIds = betsInGroup.map((bet) => bet.id);

  const nominationsWithFilteredBets: Nomination[] = nominationsWithBets.map(
    (n) => ({
      ...n,
      bets: (n.bets || []).filter((b) => betIds.includes(b))
    })
  );
  const playersWithFilteredBets: Player[] = playersInGroup.map((p) => ({
    ...p,
    bets: (p.bets || []).filter((b) => betIds.includes(b))
  }));

  const normalizedNominations: NormalizedNominations = {};
  nominationsWithFilteredBets.forEach((n) => {
    normalizedNominations[n.id] = n;
  });

  const normalizedBets: NormalizedBets = {};
  if (!year.bettingOpen) {
    betsInGroup.forEach((b) => {
      normalizedBets[b.id] = b;
    });
  }

  const rawNormalizedPlayers: NormalizedPlayers = {};
  playersWithFilteredBets.forEach((player) => {
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
      normalizedNominations,
      normalizedBets,
      rawNormalizedPlayers
    );
  }

  return {
    bets: normalizedBets,
    players: normalizedPlayers
  };
};
