import { airtableMap } from 'services/maps/airtableMap';
import { PlayerId, Player } from 'types/nominations';
import { Nullable } from 'types/utilityTypes';
import { base } from './base';

const playersBase = base('players');

export const getPlayers = async (playerIds: PlayerId[]): Promise<Player[]> => {
  const params = playerIds
    ? {
        filterByFormula: `OR(${playerIds
          .map((id) => `RECORD_ID()='${id}'`)
          .join(',')})`
      }
    : {};
  const players: Player[] = [];
  await playersBase.select(params).eachPage((playersResult, fetchNextPage) => {
    playersResult.forEach((player) => {
      players.push(airtableMap.player.fromAirtable(player));
    });

    fetchNextPage();
  });

  return players;
};

export const getPlayerByAuth0Id = async (
  auth0Id: string
): Promise<Nullable<Player>> => {
  const players: Player[] = [];
  await playersBase
    .select({ filterByFormula: `auth0_user_id='${auth0Id}'` })
    .eachPage((playersResult, fetchNextPage) => {
      playersResult.forEach((player) => {
        players.push(airtableMap.player.fromAirtable(player));
      });

      fetchNextPage();
    });

  if (players.length > 1) {
    throw new Error(`Multiple records with id ${auth0Id} found.`);
  } else if (players.length === 0) {
    return null;
  } else {
    return players[0];
  }
};
