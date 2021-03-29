import { Bet } from 'types/nominations';

export const createBet = async (
  playerId: string,
  nominationId: string
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
  playerId: string
): Promise<Record<string, string>> => {
  const url = `/api/players/${playerId}/bets`;
  const options: RequestInit = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8'
    }
  };

  return apiResult<Record<string, string>>(url, options);
};

export const updateBet = async (
  betId: string,
  nominationId: string
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