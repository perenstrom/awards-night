import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import { getCategories, getFilm, getYear, getYears } from 'services/prisma';
import { getNomination } from 'services/prisma/nominations';
import {
  NormalizedCategories,
  NormalizedFilms,
  NormalizedNominations,
  // Year,
  NominationData
} from 'types/nominations';
import { Nullable } from 'types/utilityTypes';
import { calculateCompletedCategories } from 'utils/nominations';

export const NOMINATION_DATA_CACHE_KEY = 'NOMINATION_DATA_CACHE_KEY';
export const getNominationData = unstable_cache(
  cache(async (year: number): Promise<Nullable<NominationData>> => {
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

      const unfilteredNominations = await Promise.all(
        yearData.nominations.map((nom) => getNomination(nom))
      );
      const nominations = unfilteredNominations.filter((n) => !!n);

      const normalizedNominations: NormalizedNominations = {};
      nominations.forEach((n) => {
        if (!n) return;
        normalizedNominations[n.id] = n;
        normalizedCategories[n.category].nominations.push(n.id);
      });

      const unfilteredFilms = await Promise.all(
        nominations.map((n) => getFilm(n.film))
      );
      const films = unfilteredFilms.filter((f) => !!f);
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
  }),
  [],
  { tags: [NOMINATION_DATA_CACHE_KEY] }
);

export const getAllNominationData = async (): Promise<
  Nullable<NominationData[]>
> => {
  try {
    console.log('Getting all nomination data');
    const years = await getYears();
    if (!years) {
      throw new Error('Error when fetching years');
    }
    console.log('Step 2');

    const nominationData = await Promise.all(
      years.map(async (year) => {
        return getNominationData(year.year);
      })
    );
    console.log('Step 3');
    return nominationData.filter(Boolean) as NominationData[];
  } catch (error) {
    console.log(error);
    return null;
  }
};
