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

  if (bettingOpen) {
    const players = await getPlayersForGroup(group, ctx);

    return {
      bets: [],
      players: addStylesToPlayer(players),
      nominationBets: {}
    };
  } else {
    const players = await getPlayersWithBetsForGroup(group, ctx);
    const playingPlayers = players.filter((player) => player.bets.length > 0);
    const bets = await getBetsForNominations(
      nominationData.year.nominations,
      ctx
    );

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
