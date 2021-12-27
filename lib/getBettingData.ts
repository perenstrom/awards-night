import { getBets, getPlayers } from 'services/airtable';
import { getNominationBets } from 'services/airtable/nominations';
import {
  BettingData,
  GroupId,
  NominationBets,
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
  nominations: NormalizedNominations,
  group: GroupId
): Promise<BettingData> => {
  const nominationBets = await getNominationBets(year.nominations);
  const betsToFetch = Object.values(nominationBets).flat();
  const bets = await getBets(betsToFetch);
  const players = await getPlayers(bets.map((b) => b.player));
  
  const playersInGroup = players.filter((p) => p.group === group);
  const playerIds = playersInGroup.map((p) => p.id);

  const betsInGroup = bets.filter((b) => playerIds.includes(b.player));
  const betIds = betsInGroup.map((bet) => bet.id);

  const nominationBetsInGroup: NominationBets = {};

  if (!year.bettingOpen) {
    betsInGroup.forEach((bet) => {
      if (nominationBetsInGroup[bet.nomination]) {
        nominationBetsInGroup[bet.nomination].push(bet.id);
      } else {
        nominationBetsInGroup[bet.nomination] = [bet.id];
      }
    });
  }

  const playersWithFilteredBets: Player[] = playersInGroup.map((p) => ({
    ...p,
    bets: (p.bets || []).filter((b) => betIds.includes(b))
  }));

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
      nominations,
      nominationBetsInGroup,
      normalizedBets,
      rawNormalizedPlayers
    );
  }

  return {
    bets: normalizedBets,
    players: normalizedPlayers,
    nominationBets: nominationBetsInGroup
  };
};
