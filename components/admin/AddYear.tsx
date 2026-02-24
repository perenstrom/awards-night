import { unstable_cache } from 'next/cache';
import { getCategories as prismaGetCategories } from 'services/prisma';
import { CATEGORIES_CACHE_KEY } from 'lib/getNominationData';
import { AddYearForm } from './AddYearForm';

const getCategories = unstable_cache(
  async (categories: string[]) => prismaGetCategories(categories),
  [],
  { tags: [CATEGORIES_CACHE_KEY] }
);

export const AddYear = async () => {
  const categories = await getCategories([]);

  return <AddYearForm availableCategories={categories} />;
};
