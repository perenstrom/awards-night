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
  YearData,
  NormalizedBets,
  NormalizedCategories,
  NormalizedFilms,
  NormalizedNominations,
  NormalizedPlayers,
  Year,
  CategoryId,
  Category
} from 'types/nominations';
import {
  calculateCompletedCategories,
  calculatePlayersWinnings
} from 'utils/nominations';

export const getYearData = async (year: Year): Promise<YearData> => {
  const categories = await getCategories(year.categories);
  const normalizedCategories: NormalizedCategories = {};
  const categoryIdToSlug: Record<CategoryId, string> = {};
  categories.forEach((c) => {
    normalizedCategories[c.slug] = c;
    categoryIdToSlug[c.id] = c.slug;
  });

  const nominations = await getNominations(year.nominations);
  const normalizedNominations: NormalizedNominations = {};
  nominations.forEach((n) => {
    normalizedNominations[n.id] = year.bettingOpen ? { ...n, bets: [] } : n;
    normalizedCategories[categoryIdToSlug[n.category]].nominations.push(n.id);
  });

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
  if (!year.bettingOpen) {
    bets.forEach((b) => (normalizedBets[b.id] = b));
  }

  const players = await getPlayers(
    year.bettingOpen ? null : bets.map((b) => b.player)
  );

  const rawNormalizedPlayers: NormalizedPlayers = {};
  players.forEach((player) => {
    rawNormalizedPlayers[player.id] = player;
  });

  const normalizedPlayers = calculatePlayersWinnings(
    Object.values(normalizedCategories),
    normalizedNominations,
    normalizedBets,
    rawNormalizedPlayers
  );
  const status = {
    completedCategories: calculateCompletedCategories(
      Object.values(normalizedCategories),
      normalizedNominations
    )
  };

  return {
    categories: normalizedCategories,
    films: normalizedFilms,
    nominations: normalizedNominations,
    bets: normalizedBets,
    players: normalizedPlayers,
    status: status
  };
};

export const refreshNominations = async (
  year: Year
): Promise<NormalizedNominations> => {
  const nominations = await getNominations(year.nominations);

  const normalizedNominations: NormalizedNominations = {};
  nominations.forEach((n) => (normalizedNominations[n.id] = n));

  return normalizedNominations;
};
