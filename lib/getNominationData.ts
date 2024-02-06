import { unstable_cache } from 'next/cache';
import {
  getCategories,
  getFilms,
  getNominations,
  getYear
} from 'services/prisma';
import {
  NormalizedCategories,
  NormalizedFilms,
  NormalizedNominations,
  // Year,
  NominationData
} from 'types/nominations';
import { Nullable } from 'types/utilityTypes';
import { calculateCompletedCategories } from 'utils/nominations';

export const NOMINATION_DATA_TAG = 'nominationData';
export const getNominationData = unstable_cache(
  async (year: number): Promise<Nullable<NominationData>> => {
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
      categories.forEach((c) => {
        normalizedCategories[c.slug] = c;
      });

      const nominations = await getNominations(yearData.nominations);

      const normalizedNominations: NormalizedNominations = {};
      nominations.forEach((n) => {
        normalizedNominations[n.id] = n;
        normalizedCategories[n.category].nominations.push(n.id);
      });

      const films = await getFilms(nominations.map((n) => n.film));
      const normalizedFilms: NormalizedFilms = {};
      films.forEach((f) => (normalizedFilms[f.imdbId] = f));

      // Add decided property
      categories.forEach((category) => {
        const decided = category.nominations.some(
          (nominationId) => normalizedNominations[nominationId].decided
        );

        const sortedNominations = category.nominations.sort((a, b) =>
          normalizedFilms[normalizedNominations[a].film].name.localeCompare(
            normalizedFilms[normalizedNominations[b].film].name
          )
        );
        category.nominations = sortedNominations;

        category.decided = decided;
        normalizedCategories[category.slug].decided = decided;
      });

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
  },
  ['nominationData'],
  { tags: [NOMINATION_DATA_TAG] }
);

/* export const refreshNominations = async (
  year: Year
): Promise<NormalizedNominations> => {
  const nominations = await getNominations(year.nominations);

  const normalizedNominations: NormalizedNominations = {};
  nominations.forEach((n) => (normalizedNominations[n.id] = n));

  return normalizedNominations;
}; */
