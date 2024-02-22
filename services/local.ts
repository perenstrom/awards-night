import {
  Bet,
  BettingData,
  Nomination,
  NominationData,
  Player,
  TmdbFilmResult
} from 'types/nominations';
import { Maybe, StatusMessage } from 'types/utilityTypes';
import { ERROR_CODES, getError } from 'utils/errors';
import { createError, createSuccess } from 'utils/maybeHelper';

export const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json;charset=UTF-8'
};

export const createBet = async (
  playerId: number,
  nominationId: number
): Promise<Bet> => {
  const url = '/api/bets';

  const options: RequestInit = {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify({
      playerId,
      nominationId
    })
  };

  const result = await apiResult<Bet>(url, options);
  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.error.message);
  }
};

export const getLoggedInPlayer = async (): Promise<Maybe<Player>> => {
  const url = `/api/players/me`;
  const options: RequestInit = {
    method: 'GET',
    headers: defaultHeaders
  };

  return apiResult<Player>(url, options);
};

export const getBetsForPlayer = async (playerId: number): Promise<Bet[]> => {
  const url = `/api/players/${playerId}/bets`;
  const options: RequestInit = {
    method: 'GET',
    headers: defaultHeaders
  };

  const result = await apiResult<Bet[]>(url, options);
  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.error.message);
  }
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

export const updateBet = async (
  betId: number,
  nominationId: number
): Promise<Bet> => {
  const url = '/api/bets';
  const options: RequestInit = {
    method: 'PATCH',
    headers: defaultHeaders,
    body: JSON.stringify({
      betId,
      nominationId
    })
  };

  const result = await apiResult<Bet>(url, options);
  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.error.message);
  }
};

export const deleteBet = async (betId: number): Promise<number> => {
  const url = '/api/bets';
  const options: RequestInit = {
    method: 'DELETE',
    headers: defaultHeaders,
    body: JSON.stringify({
      betId
    })
  };

  const result = await apiResult<number>(url, options);
  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.error.message);
  }
};

export const createNominations = async (data: {
  category: string;
  year: number;
  films: string[];
  nominees: string[];
}): Promise<StatusMessage> => {
  const url = '/api/nominations';
  const options: RequestInit = {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify(data)
  };

  const result = await apiResult<StatusMessage>(url, options);
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

export const updateNomination = async (
  nominationId: number,
  nomination: Partial<Nomination>
): Promise<Nomination> => {
  const url = '/api/nominations';
  const options: RequestInit = {
    method: 'PATCH',
    headers: defaultHeaders,
    body: JSON.stringify({
      nominationId,
      nomination
    })
  };

  const result = await apiResult<Nomination>(url, options);
  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.error.message);
  }
};

export const createFilm = async (imdbId: string): Promise<StatusMessage> => {
  const url = '/api/films';
  const options: RequestInit = {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify({
      imdbId
    })
  };

  const result = await apiResult<StatusMessage>(url, options);
  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.error.message);
  }
};

export const createFilmByTmdb = async (
  tmdbId: string
): Promise<StatusMessage> => {
  const url = '/api/films';
  const options: RequestInit = {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify({
      tmdbId
    })
  };

  const result = await apiResult<StatusMessage>(url, options);
  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.error.message);
  }
};

export const searchFilms = async (query: string): Promise<TmdbFilmResult[]> => {
  const url = `/api/films/search?query=${query}`;
  const options: RequestInit = {
    method: 'GET',
    headers: defaultHeaders
  };

  const result = await apiResult<TmdbFilmResult[]>(url, options);
  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.error.message);
  }
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
