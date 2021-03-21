import {
  getBets,
  getCategories,
  getFilms,
  getNominations,
  getPlayers
} from 'services/nominations';
import { getPoster } from 'services/tmdb';
import {
  CategoryData,
  NormalizedBets,
  NormalizedCategories,
  NormalizedFilms,
  NormalizedNominations,
  NormalizedPlayers,
  Status
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
  films.forEach(async f => {
    const poster = await getPoster(f.imdbId);
    f.poster = poster;
  })
  const normalizedFilms: NormalizedFilms = {};
  films.forEach((f) => (normalizedFilms[f.id] = f));

  const bets = await getBets(nominations.map((n) => n.bets).flat());
  const normalizedBets: NormalizedBets = {};
  bets.forEach((b) => (normalizedBets[b.id] = b));

  const players = await getPlayers(bets.map((b) => b.player));
  const normalizedPlayers: NormalizedPlayers = {};
  players.forEach((p) => (normalizedPlayers[p.id] = p));

  const status: Status = {
    completedCategories: 0
  };
  categories.forEach((category) => {
    const categoryNominations = category.nominations;
    categoryNominations.forEach((n) => {
      if(normalizedNominations[n].won) {
        status.completedCategories++;
        const winningBets = normalizedNominations[n].bets;
        winningBets.forEach(bet => {
          normalizedPlayers[normalizedBets[bet].player].correct++;
        })
      }
    });
  });

  return {
    categories: normalizedCategories,
    films: normalizedFilms,
    nominations: normalizedNominations,
    bets: normalizedBets,
    players: normalizedPlayers,
    status: status
  };
};
