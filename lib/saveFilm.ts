import { ExternalFilm, Film } from 'types/nominations';
import { StatusMessage } from 'types/utilityTypes';
import { getFilmByImdb, createFilm } from 'services/airtable';
import {
  getFilmByImdb as getFilmFromTmdbByImdbId,
  getFilm as getFilmFromTmdbByTmdbId
} from 'services/tmdb';
import { getGenericErrorMessage, getStatusMessage } from 'utils/statusMessages';

export const saveFilm = async (imdbId: string): Promise<StatusMessage> => {
  let film: Film;
  try {
    film = await getFilmByImdb(imdbId);
  } catch (error) {
    // Airtable error
    console.error(error);
    return getGenericErrorMessage();
  }

  if (!film) {
    // Film is not already in the system
    let filmDetails: ExternalFilm = null;
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
      savedFilm = await createFilm(filmDetails);
    } catch (error) {
      // Error in airtable call
      console.error(error);
      return getGenericErrorMessage();
    }

    if (savedFilm) {
      // Film successfully saved
      return getStatusMessage('success', `${savedFilm.name} added.`);
    }
  } else {
    // Film is already in the system
    return getStatusMessage('info', `${film.name} is already added.`);
  }
};

export const saveFilmByTmdbId = async (
  tmdbId: string
): Promise<StatusMessage> => {
  let filmDetails: ExternalFilm = null;
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

  let film: Film;
  try {
    film = await getFilmByImdb(filmDetails.imdbId);
  } catch (error) {
    // Airtable error
    console.error(error);
    return getGenericErrorMessage();
  }

  if (!film) {
    // Film is not already in the system
    let savedFilm = null;
    try {
      savedFilm = await createFilm(filmDetails);
    } catch (error) {
      // Error in airtable call
      console.error(error);
      return getGenericErrorMessage();
    }

    if (savedFilm) {
      // Film successfully saved
      return getStatusMessage('success', `${savedFilm.name} added.`);
    }
  } else {
    // Film is already in the system
    return getStatusMessage('info', `${film.name} is already added.`);
  }
};
