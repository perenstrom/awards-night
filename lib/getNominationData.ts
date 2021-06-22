import {
  getCategories,
  getFilms,
  getNominations,
  setFilmPoster
} from 'services/airtable';
import { getPoster } from 'services/tmdb';
import {
  YearData,
  NormalizedCategories,
  NormalizedFilms,
  NormalizedNominations,
  Year,
  CategoryId,
  NominationData
} from 'types/nominations';
import { calculateCompletedCategories } from 'utils/nominations';

export const getNominationData = async (
  year: Year,
  withBets: boolean
): Promise<NominationData> => {
  try {
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
      normalizedNominations[n.id] = withBets ? n : { ...n, bets: [] };
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
      status: status
    };
  } catch (error) {
    console.log(error);
  }
};

export const refreshNominations = async (
  year: Year
): Promise<NormalizedNominations> => {
  const nominations = await getNominations(year.nominations);

  const normalizedNominations: NormalizedNominations = {};
  nominations.forEach((n) => (normalizedNominations[n.id] = n));

  return normalizedNominations;
};
