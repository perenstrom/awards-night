export const getPoster = (imdbId: string): Promise<string> => {
  return fetch(
    `${process.env.TMDB_BASE_URL}/${imdbId}?api_key=${process.env.TMDB_API_KEY}&language=en-US`
  )
    .then((response) => response.json())
    .then((data) => `${process.env.TMDB_POSTER_BASE_URL}${data.poster_path}`)
    .catch((error) => {
      console.warn(`Failed to fetch poster for ${imdbId}`);
      return null;
    });
};