import { getBets, getPlayers } from 'services/airtable';
import { getNominationBets } from 'services/airtable/nominations';
import { getBetsForNominations } from 'services/prisma/bets';
import {
  getPlayersForGroup,
  getPlayersWithBetsForGroup
} from 'services/prisma/players';
import { Context } from 'services/prisma/prisma.types';
import {
  Bet,
  BettingData,
  NominationBets,
  NominationData,
  NormalizedBets,
  NormalizedCategories,
  NormalizedNominations,
  NormalizedPlayers,
  Player,
  Year
} from 'types/nominations';
import { addPlayersWinnings } from 'utils/nominations';

const calculateNominationBets = (bets: Bet[]) => {
  let nominationBets: NominationBets = {};
  bets.forEach((bet) => {
    if (nominationBets[bet.nomination]) {
      nominationBets[bet.nomination].push(bet.id);
    } else {
      nominationBets[bet.nomination] = [bet.id];
    }
  });

  return nominationBets;
};

export const getBettingData = async (
  nominationData: NominationData,
  group: number,
  ctx: Context
): Promise<BettingData> => {
  const { bettingOpen } = nominationData.year;

  if (bettingOpen) {
    const players = await getPlayersForGroup(group, ctx);
    return {
      bets: [],
      players: players,
      nominationBets: {}
    };
  } else {
    const players = await getPlayersWithBetsForGroup(group, ctx);
    const bets = await getBetsForNominations(
      nominationData.year.nominations,
      ctx
    );

    const nominationBets = calculateNominationBets(bets);

    return {
      bets: bets,
      players: players,
      nominationBets: nominationBets
    };
  }

  // TODO: Write tests for this and rewrite
  /* const nominationBets = await getNominationBets(year.nominations);
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
  }*/
};
