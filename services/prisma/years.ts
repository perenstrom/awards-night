import { unstable_cache } from 'next/cache';
import { prismaMap } from 'services/maps/prismaMap';
import type { Nullable } from 'types/utilityTypes';
import type { Year } from 'types/nominations';
import { prismaContext } from 'lib/prisma';
import type { Context } from './prisma.types';

export const FILM_TAG = 'film';
export const getYear = unstable_cache(
  async (year: number): Promise<Nullable<Year>> => {
    const result = await prismaContext.prisma.year.findUnique({
      where: {
        year: year
      },
      include: {
        nominations: true,
        yearsCategories: true
      }
    });

    if (result) {
      return prismaMap.year.fromPrisma(result);
    } else {
      return null;
    }
  },
  ['year'],
  { tags: [FILM_TAG] }
);

export const getYears = async (): Promise<Year[]> => {
  const result = await prismaContext.prisma.year.findMany({
    orderBy: [
      {
        year: 'desc'
      }
    ],
    include: {
      nominations: true,
      yearsCategories: true
    }
  });

  if (result.length === 0) {
    return [];
  } else {
    return result.map((year) => prismaMap.year.fromPrisma(year));
  }
};

export const connectCategoryToYear = async (
  category: string,
  year: number,
  ctx: Context
): Promise<boolean> => {
  const result = await ctx.prisma.yearToCategory.create({
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
