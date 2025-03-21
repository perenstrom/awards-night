import { Prisma } from '@prisma/client';
import { cache } from 'react';
import { prismaMap } from 'services/maps/prismaMap';
import type { Category, Nomination } from 'types/nominations';
import prisma from 'lib/prisma';

export const getCategoryWithNominationsForYear = cache(
  async (
    category: string,
    year: number
  ): Promise<{ category: Category; nominations: Nomination[] } | null> => {
    console.log('Getting category: ', category);
    const result = await prisma.category.findUnique({
      where: {
        slug: category
      },
      include: {
        nominations: {
          where: {
            yearId: year
          }
        }
      }
    });

    if (result) {
      return prismaMap.category.withNominations.fromPrisma(result);
    } else {
      return null;
    }
  }
);

export const getCategories = cache(
  async (categories: string[]): Promise<Category[]> => {
    console.log('Getting categories');
    const args: Prisma.CategoryFindManyArgs =
      categories.length > 0
        ? {
            where: {
              slug: { in: categories }
            }
          }
        : {};
    const result = await prisma.category.findMany(args);

    if (result.length === 0) {
      return [];
    } else {
      const formattedCategories = result
        .map((category) => prismaMap.category.fromPrisma(category))
        .sort((a, b) => a.name.localeCompare(b.name));

      return addAdjacentCategories(formattedCategories);
    }
  }
);

export const getCategoriesWithNominationsForYear = cache(
  async (
    categories: string[],
    year: number
  ): Promise<{ category: Category; nominations: Nomination[] }[]> => {
    console.log('Finding categories with nominations for year');
    const result = await prisma.category.findMany({
      where: {
        slug: { in: categories }
      },
      include: {
        nominations: {
          where: {
            yearId: year
          }
        }
      }
    });

    if (result.length === 0) {
      return [];
    } else {
      const formattedCategories = result
        .map((category) =>
          prismaMap.category.withNominations.fromPrisma(category)
        )
        .sort((a, b) => a.category.name.localeCompare(b.category.name));

      const categories = addAdjacentCategories(
        formattedCategories.map((c) => c.category)
      );

      const resultCategories = formattedCategories.map((c, i) => ({
        category: categories[i],
        nominations: c.nominations
      }));

      return resultCategories;
    }
  }
);

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
