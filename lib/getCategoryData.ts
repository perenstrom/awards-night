import {
  getBets,
  getCategories,
  getFilms,
  getNominations,
  getPlayers,
  setFilmPoster
} from 'services/airtable';
import { getPoster } from 'services/tmdb';
import {
  CategoryData,
  NormalizedBets,
  NormalizedCategories,
  NormalizedFilms,
  NormalizedNominations
} from 'types/nominations';
import { calculateWinnings } from 'utils/nominations';

export const getCategoryData = async (
  bettingOpen: boolean
): Promise<CategoryData> => {
  const categories = await getCategories();
  const normalizedCategories: NormalizedCategories = {};
  categories.forEach((c) => (normalizedCategories[c.slug] = c));

  const nominations = await getNominations(
    categories.map((c) => c.nominations).flat()
  );
  const normalizedNominations: NormalizedNominations = {};
  nominations.forEach(
    (n) => (normalizedNominations[n.id] = bettingOpen ? { ...n, bets: [] } : n)
  );

  const films = await getFilms(nominations.map((n) => n.film));
  films.forEach(async (f, i) => {
    if (!f.poster) {
      const poster = await getPoster(f.imdbId);
      await setFilmPoster(f.id, poster);
      f.poster = poster;
    }
  });
  const normalizedFilms: NormalizedFilms = {};
  films.forEach((f) => (normalizedFilms[f.id] = f));

  const bets = await getBets(nominations.map((n) => n.bets).flat());
  const normalizedBets: NormalizedBets = {};
  if (!bettingOpen) {
    bets.forEach((b) => (normalizedBets[b.id] = b));
  }

  const players = await getPlayers(bettingOpen ? null : bets.map((b) => b.player));

  const { players: normalizedPlayers, status } = calculateWinnings(
    categories,
    normalizedNominations,
    normalizedBets,
    players
  );

  return {
    categories: normalizedCategories,
    films: normalizedFilms,
    nominations: normalizedNominations,
    bets: normalizedBets,
    players: normalizedPlayers,
    status: status
  };
};

export const refreshNominations = async (): Promise<NormalizedNominations> => {
  const categories = await getCategories();
  const nominations = await getNominations(
    categories.map((c) => c.nominations).flat()
  );

  const normalizedNominations: NormalizedNominations = {};
  nominations.forEach((n) => (normalizedNominations[n.id] = n));

  return normalizedNominations;
};
