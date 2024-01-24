'use server';

import { revalidateTag } from 'next/cache';
import { isAdmin } from 'lib/authorization';
import { saveFilm, saveFilmByTmdbId } from 'lib/saveFilm';
import { saveNominations } from 'lib/saveNominations';
import { FILM_TAG } from 'services/prisma/films';
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

  const result = await saveFilm(imdb);
  if (result.severity === 'success') {
    revalidateTag(FILM_TAG);
  }

  return result;
};

export const createFilmByTmdb = async (
  previousState: StatusMessage | null | undefined,
  formData: FormData
) => {
  if (!isAdmin()) return;

  const tmdbId = formData.get('tmdbId') as string;
  if (!tmdbId) return;

  const result = await saveFilmByTmdbId(tmdbId);
  if (result.severity === 'success') {
    revalidateTag(FILM_TAG);
  }

  return result;
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

export const createNominations = async (
  previousState: StatusMessage | null | undefined,
  formData: FormData
) => {
  if (!isAdmin()) return;

  const year = formData.get('year') as string;
  const category = formData.get('category') as string;
  const films = formData.getAll('films') as string[];
  const nominees = formData.getAll('nominees') as string[];

  if (!category || !year || !films || !nominees) return;

  return await saveNominations({
    category,
    year: parseInt(year, 10),
    films,
    nominees
  });
};

export const setNominationsCount = async (
  previousState: number | null,
  formData: FormData
) => {
  const nominationCount = formData.get('nominationCount') as string;
  if (!nominationCount) return 5;

  return parseInt(nominationCount, 10);
};
