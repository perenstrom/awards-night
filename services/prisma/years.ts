import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { prismaMap } from 'services/maps/prismaMap';
import type { Nullable } from 'types/utilityTypes';
import type { BaseYear, Year } from 'types/nominations';
import prisma from 'lib/prisma';

export const getYear = cache(async (year: number): Promise<Nullable<Year>> => {
  console.log(`Finding year ${year}`);
  const result = await prisma.year.findUnique({
    where: {
      year: year
    },
    include: {
      nominations: {
        orderBy: {
          id: 'asc'
        }
      },
      yearsCategories: true
    }
  });

  if (result) {
    return prismaMap.year.fromPrisma(result);
  } else {
    return null;
  }
});

export const YEARS_CACHE_KEY = 'YEARS_CACHE_KEY';
export const getYears = unstable_cache(
  cache(async (): Promise<BaseYear[]> => {
    console.log('Getting years');
    const result = await prisma.year.findMany({
      orderBy: [
        {
          year: 'desc'
        }
      ]
    });

    if (result.length === 0) {
      return [];
    } else {
      return result.map((year) => prismaMap.baseYear.fromPrisma(year));
    }
  }),
  [],
  { tags: [YEARS_CACHE_KEY] }
);

export const connectCategoryToYear = async (
  category: string,
  year: number
): Promise<boolean> => {
  console.log(`Connecting category ${category} to year ${year}`);
  const result = await prisma.yearToCategory.create({
    data: {
      categories: {
        connect: {
          slug: category
        }
      },
      years: {
        connect: {
          year: year
        }
      }
    }
  });

  if (result) {
    return true;
  } else {
    return false;
  }
};
