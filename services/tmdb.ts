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

/* fetch('http://example.com/movies.json')
  .then(response => response.json())
  .then(data => console.log(data));
 */

/* fetchMoviePoster(imdb) {
  console.log("looking for poster for " + imdb);
  axios
    .get(
      "https://api.themoviedb.org/3/movie/" +
        imdb +
        "?api_key=5774873a96411f985411b14d29388a9d&language=en-US"
    )
    .then(response => {
      const poster_url =
        "http://image.tmdb.org/t/p/w342" + response.data.poster_path;
      let movies = { ...this.state.movies };
      movies[imdb].poster_url = poster_url;

      this.setState({ movies });
    }); */
