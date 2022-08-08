import { getBetsForNominations } from 'services/prisma/bets';
import { getPlayersWithBetsForGroup } from 'services/prisma/players';
import { Context } from 'services/prisma/prisma.types';
import {
  Bet,
  BettingData,
  NominationBets,
  NominationData,
  Player
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

const addStylesToPlayer = (
  players: Player[]
): (Player & { style: number })[] => {
  const sortedPlayers = players.sort((a, b) =>
    `${a.name}-${a.id}`.localeCompare(`${b.name}-${b.id}`)
  );
  const playersWithStyle: (Player & { style: number })[] = sortedPlayers.map(
    (player, index) => ({
      ...player,
      style: index
    })
  );

  return playersWithStyle;
};

export const getBettingData = async (
  nominationData: NominationData,
  group: number,
  ctx: Context
): Promise<BettingData> => {
  const { bettingOpen } = nominationData.year;

  const players = await getPlayersWithBetsForGroup(group, ctx);
  const bets = await getBetsForNominations(
    nominationData.year.nominations,
    ctx
  );

  const betIds = bets.map((b) => b.id);
  players.forEach((player) => {
    const newBets = player.bets.filter((betId) => betIds.includes(betId));
    player.bets = newBets;
  });

  const playingPlayers = players.filter((player) => player.bets.length > 0);

  if (bettingOpen) {
    playingPlayers.forEach((player) => {
      player.bets = [];
    });

    return {
      bets: [],
      players: addStylesToPlayer(playingPlayers),
      nominationBets: {}
    };
  } else {
    const nominationBets = calculateNominationBets(bets);

    const playersWithWins = addPlayersWinnings(
      playingPlayers,
      nominationData.nominations,
      bets
    );

    return {
      bets: bets,
      players: addStylesToPlayer(playersWithWins),
      nominationBets: nominationBets
    };
  }
};
