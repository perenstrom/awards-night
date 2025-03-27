'use server';

import { revalidateTag as nextRevalidateTag } from 'next/cache';
import { isAdmin } from 'lib/authorization';
import { saveFilm, saveFilmByTmdbId } from 'lib/saveFilm';
import { saveNominations } from 'lib/saveNominations';
import { searchFilms as searchFilmsTmdb } from 'services/tmdb';
import { TmdbFilmResult } from 'types/nominations';
import { Maybe, StatusMessage } from 'types/utilityTypes';
import { ERROR_CODES, getError } from 'utils/errors';
import { createError, createSuccess } from 'utils/maybeHelper';
import {
  CATEGORIES_CACHE_KEY,
  FILMS_CACHE_KEY,
  NOMINATIONS_CACHE_KEY,
  YEAR_CACHE_KEY
} from 'lib/getNominationData';
import { getNomination, updateNomination } from 'services/prisma/nominations';
import { getStatusMessage } from 'utils/statusMessages';
import { getCategoryWithNominationsForYear } from 'services/prisma/categories';
import {
  closeYear as closeYearPrisma,
  closeBetting as closeBettingPrisma
} from 'services/prisma/years';

export const createFilm = async (
  previousState: StatusMessage | null | undefined,
  formData: FormData
) => {
  if (!isAdmin()) return;

  const imdb = formData.get('imdbId') as string;
  if (!imdb) return;

  const result = await saveFilm(imdb);
  nextRevalidateTag(FILMS_CACHE_KEY);

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
  nextRevalidateTag(FILMS_CACHE_KEY);

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

  nextRevalidateTag(NOMINATIONS_CACHE_KEY);
  nextRevalidateTag(YEAR_CACHE_KEY);
  nextRevalidateTag(CATEGORIES_CACHE_KEY);
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

  const nomination = await getNomination(nominationId);
  if (!nomination) return;

  const category = await getCategoryWithNominationsForYear(
    nomination.category,
    nomination.year
  );
  if (!category) return;

  const winningNominationsInCategory = category.nominations.filter(
    (n) => n.won
  );

  if (winningNominationsInCategory.length > 1) {
    throw new Error('Multiple wins for one category');
  }

  const relatedNominations = category.nominations.filter(
    (n) => n.id !== nominationId
  );

  if (
    winningNominationsInCategory.length === 1 &&
    winningNominationsInCategory[0].id === nominationId
  ) {
    console.log('Clicked nomination already marked as winner');
    // Clicked nomination already marked as winner
    // Remove win
    await Promise.all([
      updateNomination(nominationId, { won: false, decided: false }),
      ...relatedNominations.map((n) =>
        updateNomination(n.id, { decided: false })
      )
    ]);
  } else if (winningNominationsInCategory.length === 1) {
    console.log('Clicked nomination when another already marked as winner');
    // Clicked nomination when another already marked as winner
    // Update both old and new
    await Promise.all([
      updateNomination(winningNominationsInCategory[0].id, {
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
      ...relatedNominations.map((n) =>
        updateNomination(n.id, { decided: true })
      )
    ]);
  }

  nextRevalidateTag(NOMINATIONS_CACHE_KEY);
  nextRevalidateTag(YEAR_CACHE_KEY);
  nextRevalidateTag(CATEGORIES_CACHE_KEY);
};

export const closeYear = async (formData: FormData) => {
  if (!isAdmin()) return;

  const rawYear = formData.get('year') as string;
  if (!rawYear) return;
  const year = parseInt(rawYear, 10);

  await closeYearPrisma(year);

  nextRevalidateTag(YEAR_CACHE_KEY);
};

export const closeBetting = async (formData: FormData) => {
  if (!isAdmin()) return;

  const rawYear = formData.get('year') as string;
  if (!rawYear) return;
  const year = parseInt(rawYear, 10);

  await closeBettingPrisma(year);

  nextRevalidateTag(YEAR_CACHE_KEY);
};

export const revalidateTag = async (
  previousState: StatusMessage | null | undefined,
  formData: FormData
) => {
  if (!isAdmin()) return;

  const tag = formData.get('tag') as string;
  if (!tag) return;

  nextRevalidateTag(tag);

  return getStatusMessage('info', `Tag ${tag} revalidated.`);
};
