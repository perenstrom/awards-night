import { getPlayers } from "services/airtable";
import { airtableMap } from "services/maps/airtableMap";
import { Bet, BetId, PlayerId, NominationId } from "types/nominations";
import { PartialBy } from "types/utilityTypes";
import { base } from "./base";

const betsBase = base('bets');

export const createBet = async (bet: PartialBy<Bet, 'id'>): Promise<Bet> => {
  console.log(`Creating bet:\n${JSON.stringify(bet, null, 2)}`);
  return new Promise((resolve, reject) => {
    betsBase
      .create(airtableMap.bet.toAirtable(bet))
      .then((result) => resolve(airtableMap.bet.fromAirtable(result)))
      .catch((error) => {
        reject(error);
        console.error(error);
      });
  });
};

export const getBets = async (betIds: BetId[]): Promise<Bet[]> => {
  if (betIds.length === 0) {
    return [];
  }

  const query = `OR(${betIds.map((id) => `RECORD_ID()='${id}'`).join(',')})
    `;
  const bets: Bet[] = [];
  await betsBase
    .select({ filterByFormula: query })
    .eachPage((betsResult, fetchNextPage) => {
      betsResult.forEach((bet) => {
        bets.push(airtableMap.bet.fromAirtable(bet));
      });

      fetchNextPage();
    });

  return bets;
};

export const getBetsForPlayer = async (
  playerId: PlayerId
): Promise<Record<NominationId, BetId>> => {
  try {
    const player = await getPlayers([playerId]);
    const bets = await getBets(player[0].bets ?? []);
    const nominationBets: Record<NominationId, BetId> = {};
    bets.forEach((bet) => (nominationBets[bet.nomination] = bet.id));

    return nominationBets;
  } catch (error) {
    console.error(error);
    return {};
  }
};

export const updateBet = async (
  betId: BetId,
  nominationId: NominationId
): Promise<Bet> => {
  console.log(
    `Updating bet:\n${JSON.stringify({ betId, nominationId }, null, 2)}`
  );
  return new Promise((resolve, reject) => {
    betsBase
      .update(betId, airtableMap.bet.toAirtable({ nomination: nominationId }))
      .then((result) => resolve(airtableMap.bet.fromAirtable(result)))
      .catch((error) => {
        reject(error);
        console.error(error);
      });
  });
};

export const deleteBet = async (betId: BetId): Promise<BetId> => {
  console.log(`Deleting bet:\n${JSON.stringify({ betId }, null, 2)}`);
  return new Promise((resolve, reject) => {
    betsBase
      .destroy(betId)
      .then((result) => resolve(result.id as BetId))
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
};