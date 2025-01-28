import { cache } from 'react';
import {
  getCategories,
  getFilms,
  getNominations,
  getYear,
  getYears
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
export const getNominationData = cache(
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
  }
);

export const getAllNominationData = async (): Promise<
  Nullable<NominationData[]>
> => {
  try {
    const years = await getYears();
    if (!years) {
      throw new Error('Error when fetching years');
    }

    const nominationData = await Promise.all(
      years.map(async (year) => {
        return getNominationData(year.year);
      })
    );

    return nominationData.filter(Boolean) as NominationData[];
  } catch (error) {
    console.log(error);
    return null;
  }
};
