import {
  getCategories,
  getFilms,
  getNominations,
  getYear,
  setFilmPoster
} from 'services/airtable';
import { getPoster } from 'services/tmdb';
import {
  NormalizedCategories,
  NormalizedFilms,
  NormalizedNominations,
  Year,
  CategoryId,
  NominationData
} from 'types/nominations';
import { Nullable } from 'types/utilityTypes';
import { calculateCompletedCategories } from 'utils/nominations';

export const getNominationData = async (
  year: number
): Promise<Nullable<NominationData>> => {
  try {
    const yearData = await getYear(year);
    if (!yearData) {
      throw new Error('Error when fetching year data');
    }

    const categories = await getCategories(yearData.categories);
    if (!categories) {
      throw new Error('Error when fetching categories');
    }
    const normalizedCategories: NormalizedCategories = {};
    const categoryIdToSlug: Record<CategoryId, string> = {};
    categories.forEach((c) => {
      normalizedCategories[c.slug as CategoryId] = c;
      categoryIdToSlug[c.id] = c.slug;
    });

    const nominations = await getNominations(yearData.nominations);

    const normalizedNominations: NormalizedNominations = {};
    nominations.forEach((n) => {
      normalizedNominations[n.id] = n;
      normalizedCategories[
        categoryIdToSlug[n.category] as CategoryId
      ].nominations.push(n.id);
    });

    const films = await getFilms(nominations.map((n) => n.film));
    films.forEach(async (f) => {
      if (!f.poster) {
        const poster = await getPoster(f.imdbId);
        if (poster) {
          await setFilmPoster(f.id, poster);
          f.poster = poster;
        }
      }
    });
    const normalizedFilms: NormalizedFilms = {};
    films.forEach((f) => (normalizedFilms[f.id] = f));

    const meta = {
      completedCategories: calculateCompletedCategories(
        Object.values(normalizedCategories),
        normalizedNominations
      )
    };

    return {
      year: yearData,
      categories: normalizedCategories,
      films: normalizedFilms,
      nominations: normalizedNominations,
      meta: meta
    };
  } catch (error) {
    console.log(error);
    return null;
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
