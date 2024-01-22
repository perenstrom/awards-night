'use server';

import { isAdmin } from 'lib/authorization';
import { saveFilm, saveFilmByTmdbId } from 'lib/saveFilm';
import { searchFilms as searchFilmsTmdb } from 'services/tmdb';
import { TmdbFilmResult } from 'types/nominations';
import { Maybe, StatusMessage } from 'types/utilityTypes';
import { ERROR_CODES, getError } from 'utils/errors';
import { createError, createSuccess } from 'utils/maybeHelper';

export const createFilm = async (
  previousState: StatusMessage | null | undefined,
  formData: FormData
) => {
  if (!isAdmin()) return;

  const imdb = formData.get('imdbId') as string;
  if (!imdb) return;

  return await saveFilm(imdb);
};

export const createFilmByTmdb = async (
  previousState: StatusMessage | null | undefined,
  formData: FormData
) => {
  if (!isAdmin()) return;

  const tmdbId = formData.get('tmdbId') as string;
  if (!tmdbId) return;

  return await saveFilmByTmdbId(tmdbId);
};

export const searchFilms = async (
  previousState: Maybe<TmdbFilmResult[]> | undefined | null,
  formData: FormData
) => {
  if (!isAdmin()) return;

  const query = formData.get('filmQuery') as string;
  if (!query) return;

  try {
    const result = await searchFilmsTmdb(query);
    return createSuccess(result);
  } catch (error) {
    return createError(getError(ERROR_CODES.TMDB_SEARCH_ERROR));
  }
};
