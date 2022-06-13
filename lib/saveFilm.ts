import { Film } from 'types/nominations';
import { Nullable, StatusMessage } from 'types/utilityTypes';
import {
  getFilmByImdb as getFilmFromTmdbByImdbId,
  getFilm as getFilmFromTmdbByTmdbId
} from 'services/tmdb';
import { getGenericErrorMessage, getStatusMessage } from 'utils/statusMessages';
import { createFilm, getFilm } from 'services/prisma/films';
import { prismaContext } from './prisma';

export const saveFilm = async (imdbId: string): Promise<StatusMessage> => {
  let film: Nullable<Film>;
  try {
    film = await getFilm(imdbId, prismaContext);
  } catch (error) {
    // Prisma error
    console.error(error);
    return getGenericErrorMessage();
  }

  if (!film) {
    // Film is not already in the system
    let filmDetails: Nullable<Film> = null;
    try {
      filmDetails = await getFilmFromTmdbByImdbId(imdbId);
    } catch (error) {
      // TMDb error
      console.error(error);
      return getGenericErrorMessage();
    }

    if (!filmDetails) {
      // Couldn't fetch info from TMDb
      return getStatusMessage(
        'error',
        `Couldn't get movie details from TMDb for ${imdbId}.`
      );
    }

    let savedFilm = null;
    try {
      savedFilm = await createFilm(filmDetails, prismaContext);
    } catch (error) {
      // Error in prisma call
      console.error(error);
      return getGenericErrorMessage();
    }

    if (savedFilm) {
      // Film successfully saved
      return getStatusMessage('success', `${savedFilm.name} added.`);
    } else {
      // Error in saving
      console.error('No film returned by save call');
      return getGenericErrorMessage();
    }
  } else {
    // Film is already in the system
    return getStatusMessage('info', `${film.name} is already added.`);
  }
};

export const saveFilmByTmdbId = async (
  tmdbId: string
): Promise<StatusMessage> => {
  let filmDetails: Nullable<Film> = null;
  try {
    filmDetails = await getFilmFromTmdbByTmdbId(tmdbId);
  } catch (error) {
    // Network error
    return getStatusMessage(
      'error',
      `Couldn't get movie details from TMDb for ${tmdbId}.`
    );
  }

  if (!filmDetails) {
    // Couldn't fetch info from TMDb
    return getStatusMessage(
      'error',
      `Couldn't get movie details from TMDb for ${tmdbId}.`
    );
  }

  let film: Nullable<Film>;
  try {
    film = await getFilm(filmDetails.imdbId, prismaContext);
  } catch (error) {
    // Prisma error
    console.error(error);
    return getGenericErrorMessage();
  }

  if (!film) {
    // Film is not already in the system
    let savedFilm = null;
    try {
      savedFilm = await createFilm(filmDetails, prismaContext);
    } catch (error) {
      // Error in prisma call
      console.error(error);
      return getGenericErrorMessage();
    }

    if (savedFilm) {
      // Film successfully saved
      return getStatusMessage('success', `${savedFilm.name} added.`);
    } else {
      // Error in saving
      console.error('No film returned by save call');
      return getGenericErrorMessage();
    }
  } else {
    // Film is already in the system
    return getStatusMessage('info', `${film.name} is already added.`);
  }
};
