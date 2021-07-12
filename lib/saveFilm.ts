import { Film } from 'types/nominations';
import { Severity, StatusMessage } from 'types/utilityTypes';
import { getFilmByImdb, createFilm } from 'services/airtable';
import { getFilm as getFilmFromTmdb } from 'services/tmdb';

const getStatusMessage = (
  severity: Severity,
  message: string
): StatusMessage => {
  return {
    severity,
    message
  };
};

const getGenericErrorMessage = () => {
  return getStatusMessage('error', 'Something went wrong, please try again.');
};

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
    let filmDetails = null;
    try {
      filmDetails = await getFilmFromTmdb(imdbId);
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
      savedFilm = await createFilm({
        imdb_id: filmDetails.imdbId,
        name: filmDetails.name,
        poster_url: filmDetails.poster,
        nominations: null
      });
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
