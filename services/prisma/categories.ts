import { prismaMap } from 'services/maps/prismaMap';

import type { Category } from 'types/nominations';
import type { Context } from './prisma.types';

export const getCategories = async (
  categories: string[],
  ctx: Context
): Promise<Category[]> => {
  const result = await ctx.prisma.category.findMany({
    where: {
      slug: { in: categories }
    }
  });

  if (result.length === 0) {
    return [];
  } else {
    const formattedCategories = result
      .map((category) => prismaMap.category.fromPrisma(category))
      .sort((a, b) => a.name.localeCompare(b.name));

    return addAdjacentCategories(formattedCategories);
  }
};

const addAdjacentCategories = (categories: Category[]): Category[] => {
  return categories.map((category, index, categories) => {
    const previousCategory =
      index === 0
        ? { previousCategory: null }
        : { previousCategory: categories[index - 1].slug };
    const nextCategory =
      index === categories.length - 1
        ? { nextCategory: null }
        : { nextCategory: categories[index + 1].slug };
    return { ...category, ...previousCategory, ...nextCategory };
  });
};
