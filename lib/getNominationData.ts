import {
  getCategories,
  getFilms,
  getNominations,
  getPlayers
} from 'services/airtable';
import { getPoster } from 'services/tmdb';
import {
  NominationData,
  NormalizedFilms,
  NormalizedNominations
} from 'types/nominations';

export const getNominationData = async (): Promise<NominationData> => {
  const categories = await getCategories();

  const nominations = await getNominations(
    categories.map((c) => c.nominations).flat()
  );

  const decidedCategories: string[] = [];
  nominations.forEach((nomination) => {
    if (nomination.won) {
      decidedCategories.push(nomination.category);
    }
  });

  const films = await getFilms(nominations.map((n) => n.film));
  films.forEach(async (f) => {
    const poster = await getPoster(f.imdbId);
    f.poster = poster;
  });
  const normalizedFilms: NormalizedFilms = {};
  films.forEach((f) => (normalizedFilms[f.id] = f));

  const normalizedNominations: NormalizedNominations = {};
  nominations.forEach(
    (n) =>
      (normalizedNominations[n.id] = {
        ...n,
        bets: [],
        decided: decidedCategories.includes(n.category)
      })
  );

  return {
    categories: categories,
    nominations: normalizedNominations,
    films: normalizedFilms
  };
};
