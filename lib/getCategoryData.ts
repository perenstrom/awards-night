import {
  getBets,
  getCategories,
  getFilms,
  getNominations,
  getPlayers
} from 'services/nominations';
import {
  CategoryData,
  NormalizedBets,
  NormalizedCategories,
  NormalizedFilms,
  NormalizedNominations,
  NormalizedPlayers
} from 'types/nominations';

export const getCategoryData = async (): Promise<CategoryData> => {
  const categories = await getCategories();
  const normalizedCategories: NormalizedCategories = {};
  categories.forEach((c) => (normalizedCategories[c.slug] = c));

  const nominations = await getNominations(
    categories.map((c) => c.nominations).flat()
  );
  const normalizedNominations: NormalizedNominations = {};
  nominations.forEach((n) => (normalizedNominations[n.id] = n));

  const films = await getFilms(nominations.map((n) => n.film));
  const normalizedFilms: NormalizedFilms = {};
  films.forEach((f) => (normalizedFilms[f.id] = f));

  const bets = await getBets(nominations.map((n) => n.bets).flat());
  const normalizedBets: NormalizedBets = {};
  bets.forEach((b) => (normalizedBets[b.id] = b));

  const players = await getPlayers(bets.map((b) => b.player));
  const normalizedPlayers: NormalizedPlayers = {};
  players.forEach((p) => (normalizedPlayers[p.id] = p));

  return {
    categories: normalizedCategories,
    films: normalizedFilms,
    nominations: normalizedNominations,
    bets: normalizedBets,
    players: normalizedPlayers
  };
};
