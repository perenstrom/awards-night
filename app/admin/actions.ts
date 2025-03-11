'use server';

import { revalidateTag as revalidateTagNext } from 'next/cache';
import { isAdmin } from 'lib/authorization';
import { saveFilm, saveFilmByTmdbId } from 'lib/saveFilm';
import { saveNominations } from 'lib/saveNominations';
import { searchFilms as searchFilmsTmdb } from 'services/tmdb';
import { TmdbFilmResult } from 'types/nominations';
import { Maybe, StatusMessage } from 'types/utilityTypes';
import { ERROR_CODES, getError } from 'utils/errors';
import { createError, createSuccess } from 'utils/maybeHelper';
import {
  getNominationData,
  NOMINATION_DATA_CACHE_KEY
} from 'lib/getNominationData';
import { updateNomination } from 'services/prisma/nominations';
import { getStatusMessage } from 'utils/statusMessages';

export const createFilm = async (
  previousState: StatusMessage | null | undefined,
  formData: FormData
) => {
  if (!isAdmin()) return;

  const imdb = formData.get('imdbId') as string;
  if (!imdb) return;

  const result = await saveFilm(imdb);

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

  const result = await saveNominations({
    category,
    year: parseInt(year, 10),
    films,
    nominees
  });

  revalidateTagNext(NOMINATION_DATA_CACHE_KEY);
  return result;
};

export const setNominationsCount = async (
  previousState: number | null | undefined,
  formData: FormData
) => {
  if (!isAdmin()) return;

  const nominationCount = formData.get('nominationCount') as string;
  if (!nominationCount) return 5;

  return parseInt(nominationCount, 10);
};

export const setWinner = async (formData: FormData) => {
  if (!isAdmin()) return;

  const rawNominationId = formData.get('nominationId') as string;
  if (!rawNominationId) return;
  const nominationId = parseInt(rawNominationId, 10);

  const year = formData.get('year') as string;
  if (!year) return;

  const nominationData = await getNominationData(parseInt(year, 10));
  if (!nominationData) return;

  const nomination = nominationData.nominations[nominationId];
  const category = nominationData.categories[nomination.category];

  const winningNominationsInCategory = category.nominations.filter(
    (n) => nominationData.nominations[n].won
  );

  if (winningNominationsInCategory.length > 1) {
    throw new Error('Multiple wins for one category');
  }

  const relatedNominations = category.nominations.filter(
    (n) => n !== nominationId && n !== winningNominationsInCategory[0]
  );

  if (winningNominationsInCategory[0] === nominationId) {
    console.log('Clicked nomination already marked as winner');
    // Clicked nomination already marked as winner
    // Remove win
    await Promise.all([
      updateNomination(nominationId, { won: false, decided: false }),
      ...relatedNominations.map((n) => updateNomination(n, { decided: false }))
    ]);
  } else if (winningNominationsInCategory[0]) {
    console.log('Clicked nomination when another already marked as winner');
    // Clicked nomination when another already marked as winner
    // Update both old and new
    await Promise.all([
      updateNomination(winningNominationsInCategory[0], {
        won: false
      }),
      updateNomination(nominationId, {
        won: true
      })
    ]);
  } else {
    console.log('Clicked nomination when no other already marked as winner');
    // Clicked nomination when no other already marked as winner
    // Set new
    await Promise.all([
      updateNomination(nominationId, {
        won: true,
        decided: true
      }),
      ...relatedNominations.map((nominationId) =>
        updateNomination(nominationId, { decided: true })
      )
    ]);
  }

  revalidateTagNext(NOMINATION_DATA_CACHE_KEY);
};

export const revalidateTag = async (
  previousState: StatusMessage | null | undefined,
  formData: FormData
) => {
  if (!isAdmin()) return;

  const tag = formData.get('tag') as string;
  if (!tag) return;

  revalidateTagNext(tag);

  return getStatusMessage('info', `Tag ${tag} revalidated.`);
};
