import { unstable_cache } from 'next/cache';
import {
  getCategories as prismaGetCategories,
  getFilms,
  getYears
} from 'services/prisma';
import { CATEGORIES_CACHE_KEY } from 'lib/getNominationData';
import { AddNominationsForm } from './AddNominationsForm';

const getCategories = unstable_cache(
  async (categories: string[]) => prismaGetCategories(categories),
  [],
  { tags: [CATEGORIES_CACHE_KEY] }
);

export const AddNominations = async () => {
  const categories = await getCategories([]);
  const years = await getYears();
  const films = await getFilms([]);

  return (
    <AddNominationsForm
      availableCategories={categories}
      availableFilms={films}
      availableYears={years}
    />
  );
};
