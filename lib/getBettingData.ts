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
  NominationData
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

    const playersWithWins = addPlayersWinnings(
      players,
      nominationData.nominations,
      bets
    );

    return {
      bets: bets,
      players: playersWithWins,
      nominationBets: nominationBets
    };
  }
};
