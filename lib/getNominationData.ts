import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import {
  getCategories as prismaGetCategories,
  getFilm,
  getYear as prismaGetYear,
  getYears
} from 'services/prisma';
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

export const YEAR_CACHE_KEY = 'YEAR_CACHE_KEY';
const getYear = unstable_cache(
  async (year: number) => prismaGetYear(year),
  [],
  { tags: [YEAR_CACHE_KEY] }
);

export const CATEGORIES_CACHE_KEY = 'CATEGORIES_CACHE_KEY';
const getCategories = unstable_cache(
  async (categories: string[]) => prismaGetCategories(categories),
  [],
  { tags: [CATEGORIES_CACHE_KEY] }
);

export const NOMINATIONS_CACHE_KEY = 'NOMINATIONS_CACHE_KEY';
const getNominations = unstable_cache(
  async (nominationIDs: number[]) => {
    const unfilteredNominations = await Promise.all(
      nominationIDs.map((nom) => getNomination(nom))
    );

    return unfilteredNominations.filter((n) => !!n);
  },
  [],
  { tags: [NOMINATIONS_CACHE_KEY] }
);

export const FILMS_CACHE_KEY = 'FILMS_CACHE_KEY';
const getFilms = unstable_cache(
  async (ids: string[]) => {
    const films = await Promise.all(ids.map((id) => getFilm(id)));
    return films.filter((f) => !!f);
  },
  [],
  { tags: [FILMS_CACHE_KEY] }
);

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
        if (!n) return;
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
