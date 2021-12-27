import {
  Bet,
  BetId,
  BettingData,
  CategoryId,
  FilmId,
  Nomination,
  NominationId,
  NormalizedCategories,
  NormalizedNominations,
  Player,
  PlayerId,
  TmdbFilmResult,
  Year
} from 'types/nominations';
import { StatusMessage } from 'types/utilityTypes';

export const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json;charset=UTF-8'
};

export const createBet = async (
  playerId: PlayerId,
  nominationId: NominationId
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

  return apiResult<Bet>(url, options);
};

export const getLoggedInPlayer = async (): Promise<Player> => {
  const url = `/api/players/me`;
  const options: RequestInit = {
    method: 'GET',
    headers: defaultHeaders
  };

  return apiResult<Player>(url, options);
};

export const getBetsForPlayer = async (
  playerId: PlayerId
): Promise<Record<NominationId, BetId>> => {
  const url = `/api/players/${playerId}/bets`;
  const options: RequestInit = {
    method: 'GET',
    headers: defaultHeaders
  };

  return apiResult<Record<NominationId, BetId>>(url, options);
};

export const getBettingData = async (data: {
  year: Year;
  categories: NormalizedCategories;
  nominations: NormalizedNominations;
  playerId: PlayerId;
}): Promise<BettingData> => {
  const url = `/api/bets/bettingdata`;

  const options: RequestInit = {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify(data)
  };

  return apiResult<BettingData>(url, options);
};

export const updateBet = async (
  betId: BetId,
  nominationId: NominationId
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

  return apiResult<Bet>(url, options);
};

export const deleteBet = async (betId: BetId): Promise<BetId> => {
  const url = '/api/bets';
  const options: RequestInit = {
    method: 'DELETE',
    headers: defaultHeaders,
    body: JSON.stringify({
      betId
    })
  };

  return apiResult<BetId>(url, options);
};

export const createNominations = async (data: {
  category: CategoryId;
  year: number;
  films: FilmId[];
  nominees: string[];
}): Promise<StatusMessage> => {
  const url = '/api/nominations';
  const options: RequestInit = {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify(data)
  };

  return apiResult<StatusMessage>(url, options);
};

export const updateNomination = async (
  nominationId: NominationId,
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

  return apiResult<Nomination>(url, options);
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

  return apiResult<StatusMessage>(url, options);
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

  return apiResult<StatusMessage>(url, options);
};

export const searchFilms = async (query: string): Promise<TmdbFilmResult[]> => {
  const url = `/api/films/search?query=${query}`;
  const options: RequestInit = {
    method: 'GET',
    headers: defaultHeaders
  };

  return apiResult<TmdbFilmResult[]>(url, options);
};

const apiResult = <K>(url: RequestInfo, options: RequestInit): Promise<K> =>
  new Promise((resolve, reject) => {
    fetch(url, options)
      .then((response) => {
        if (response.status === 200) {
          resolve(response.json());
        } else {
          process.env.NODE_ENV === 'development' &&
            console.error(response.status);
          reject(response.status);
        }
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
