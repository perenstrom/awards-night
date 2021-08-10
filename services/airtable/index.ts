export { getYear, getYears, updateYear } from './years';
export { getCategories } from './categories';
export {
  createNominations,
  getNominations,
  getNominationsByCategoryAndYear,
  updateNomination
} from './nominations';
export {
  createFilm,
  getFilmByImdb,
  getFilms,
  updateFilm,
  setFilmPoster
} from './films';
export {
  createBet,
  getBets,
  deleteBet,
  getBetsForPlayer,
  updateBet
} from './bets';
export { getPlayerByAuth0Id, getPlayers } from './players';
