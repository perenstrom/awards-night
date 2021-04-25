import {
  Bet,
  BetId,
  Nomination,
  NominationId,
  PlayerId
} from 'types/nominations';

export const createBet = async (
  playerId: PlayerId,
  nominationId: NominationId
): Promise<Bet> => {
  const url = '/api/bets';
  const options: RequestInit = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body: JSON.stringify({
      playerId,
      nominationId
    })
  };

  return apiResult<Bet>(url, options);
};

export const getBetsForPlayer = async (
  playerId: PlayerId
): Promise<Record<NominationId, BetId>> => {
  const url = `/api/players/${playerId}/bets`;
  const options: RequestInit = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8'
    }
  };

  return apiResult<Record<NominationId, BetId>>(url, options);
};

export const updateBet = async (
  betId: BetId,
  nominationId: NominationId
): Promise<Bet> => {
  const url = '/api/bets';
  const options: RequestInit = {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body: JSON.stringify({
      betId,
      nominationId
    })
  };

  return apiResult<Bet>(url, options);
};

export const updateNomination = async (
  nominationId: NominationId,
  nomination: Partial<Nomination>
): Promise<Nomination> => {
  const url = '/api/nominations';
  const options: RequestInit = {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body: JSON.stringify({
      nominationId,
      nomination
    })
  };

  return apiResult<Nomination>(url, options);
};

const apiResult = <K>(url: RequestInfo, options: RequestInit): Promise<K> =>
  new Promise((resolve, reject) => {
    fetch(url, options)
      .then((response) => {
        if (response.status === 200) {
          resolve(response.json());
        } else {
          console.error(response.status);
          reject(response.status);
        }
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
