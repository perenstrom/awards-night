import {
  BettingData,
  Nomination,
  NominationData,
  Player
} from 'types/nominations';
import { Maybe } from 'types/utilityTypes';
import { ERROR_CODES, getError } from 'utils/errors';
import { createError, createSuccess } from 'utils/maybeHelper';

export const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json;charset=UTF-8'
};

export const getLoggedInPlayer = async (): Promise<Maybe<Player>> => {
  const url = `/api/players/me`;
  const options: RequestInit = {
    method: 'GET',
    headers: defaultHeaders
  };

  return apiResult<Player>(url, options);
};

export const getBettingData = async (data: {
  nominationData: NominationData;
  group: number;
  playerId: number;
}): Promise<BettingData> => {
  const url = `/api/bets/bettingdata`;

  const options: RequestInit = {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify(data)
  };

  const result = await apiResult<BettingData>(url, options);
  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.error.message);
  }
};

export const getNominations = async (
  year: number
): Promise<Maybe<Nomination[]>> => {
  const url = `/api/nominations?year=${year}`;
  const options: RequestInit = {
    method: 'GET',
    headers: defaultHeaders
  };

  return apiResult<Nomination[]>(url, options);
};

const apiResult = <K>(
  url: RequestInfo,
  options: RequestInit
): Promise<Maybe<K>> =>
  new Promise((resolve) => {
    fetch(url, options)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) {
          resolve(createError(getError(ERROR_CODES.API_RESULT_401)));
        } else if (response.status === 404) {
          resolve(createError(getError(ERROR_CODES.API_RESULT_404)));
        } else {
          resolve(createError(getError(ERROR_CODES.API_RESULT_UNHANDLED_CODE)));
        }
      })
      .then((response) => {
        resolve(createSuccess<K>(response as unknown as K));
      })
      .catch((error) => {
        console.error(error);
        resolve(
          createError(getError(ERROR_CODES.API_RESULT_UNHANDLED_EXCEPTION))
        );
      });
  });
