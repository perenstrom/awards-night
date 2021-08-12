import { airtableMap } from 'services/maps/airtableMap';
import { Film, FilmId } from 'types/nominations';
import { PartialBy } from 'types/utilityTypes';
import { base } from './base';

const filmsBase = base('films');

export const createFilm = async (
  film: PartialBy<Film, 'id'>
): Promise<Film> => {
  console.log(`Creating film:\n${JSON.stringify(film, null, 2)}`);
  return new Promise((resolve, reject) => {
    filmsBase
      .create(airtableMap.film.toAirtable(film))
      .then((result) => resolve(airtableMap.film.fromAirtable(result)))
      .catch((error) => {
        reject(error);
        console.error(error);
      });
  });
};

export const getFilms = async (filmIds?: FilmId[]): Promise<Film[]> => {
  const query = filmIds
    ? {
        filterByFormula: `OR(${filmIds
          .map((id) => `RECORD_ID()='${id}'`)
          .join(',')})`
      }
    : {};

  const films: Film[] = [];
  try {
    await filmsBase
      .select({ ...query, sort: [{ field: 'name', direction: 'asc' }] })
      .eachPage((filmsResult, fetchNextPage) => {
        filmsResult.forEach((film) => {
          films.push(airtableMap.film.fromAirtable(film));
        });

        fetchNextPage();
      });
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
  return films;
};

export const getFilmByImdb = async (imdbId: string): Promise<Film> => {
  const query = `imdb_id='${imdbId}'`;
  const films: Film[] = [];

  await filmsBase
    .select({ filterByFormula: query })
    .eachPage((filmsResult, fetchNextPage) => {
      filmsResult.forEach((film) => {
        films.push(airtableMap.film.fromAirtable(film));
      });

      fetchNextPage();
    });

  if (films.length > 1) {
    throw new Error(`Multiple records with imdb id ${imdbId} found.`);
  } else if (films.length === 0) {
    return null;
  } else {
    return films[0];
  }
};

export const updateFilm = async (
  filmId: FilmId,
  film: Partial<Film>
): Promise<Film> => {
  console.log(
    `Updating film:\n${JSON.stringify({ filmId, ...film }, null, 2)}`
  );
  return new Promise((resolve, reject) => {
    filmsBase
      .update(filmId, airtableMap.film.toAirtable(film))
      .then((result) => resolve(airtableMap.film.fromAirtable(result)))
      .catch((error) => {
        reject(error);
        console.error(error);
      });
  });
};

export const setFilmPoster = async (
  filmId: FilmId,
  poster: string
): Promise<Film> => {
  return updateFilm(filmId, { poster });
};
