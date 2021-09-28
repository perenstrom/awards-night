import { Film } from 'types/nominations';
import { MovieDetails } from './tmdb.types';

export const getPoster = (imdbId: string): Promise<string> => {
  return fetch(
    `${process.env.TMDB_BASE_URL}/movie/${imdbId}?api_key=${process.env.TMDB_API_KEY}&language=en-US`
  )
    .then((response) => response.json() as MovieDetails)
    .then((data) => `${process.env.TMDB_POSTER_BASE_URL}${data.poster_path}`)
    .catch(() => {
      console.warn(`Failed to fetch poster for ${imdbId}`);
      return null;
    });
};

export const getFilm = (imdbId: string): Promise<Omit<Film, 'id'>> => {
  return fetch(
    `${process.env.TMDB_BASE_URL}/movie/${imdbId}?api_key=${process.env.TMDB_API_KEY}&language=en-US`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.success === false) {
        console.warn(data);
        return null;
      } else {
        return formatTmdbFilm(data);
      }
    })
    .catch((error) => {
      console.warn(`Failed to fetch movie details for ${imdbId}, ${error}`);
      throw error;
    });
};

const formatTmdbFilm = (film: MovieDetails): Omit<Film, 'id'> => ({
  imdbId: film.imdb_id,
  name: film.title,
  poster: `${process.env.TMDB_POSTER_BASE_URL}${film.poster_path}`
});
