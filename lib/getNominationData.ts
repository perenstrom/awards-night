import { getCategories, getFilms, getNominations, getYear } from 'services/prisma';
import { Context } from 'services/prisma/prisma.types';
import {
  NormalizedCategories,
  NormalizedFilms,
  NormalizedNominations,
  // Year,
  NominationData
} from 'types/nominations';
import { Nullable } from 'types/utilityTypes';
import { calculateCompletedCategories } from 'utils/nominations';

export const getNominationData = async (
  year: number,
  ctx: Context
): Promise<Nullable<NominationData>> => {
  try {
    const yearData = await getYear(year, ctx);
    if (!yearData) {
      throw new Error('Error when fetching year data');
    }

    const categories = await getCategories(yearData.categories, ctx);
    if (!categories) {
      throw new Error('Error when fetching categories');
    }
    const normalizedCategories: NormalizedCategories = {};
    categories.forEach((c) => {
      normalizedCategories[c.slug] = c;
    });

    const nominations = await getNominations(yearData.nominations, ctx);

    const normalizedNominations: NormalizedNominations = {};
    nominations.forEach((n) => {
      normalizedNominations[n.id] = n;
      normalizedCategories[n.category].nominations.push(n.id);
    });

    const films = await getFilms(nominations.map((n) => n.film), ctx);
    const normalizedFilms: NormalizedFilms = {};
    films.forEach((f) => (normalizedFilms[f.imdbId] = f));

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

/* export const refreshNominations = async (
  year: Year
): Promise<NormalizedNominations> => {
  const nominations = await getNominations(year.nominations);

  const normalizedNominations: NormalizedNominations = {};
  nominations.forEach((n) => (normalizedNominations[n.id] = n));

  return normalizedNominations;
}; */
