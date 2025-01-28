import { unstable_cache } from 'next/cache';
import { prismaMap } from 'services/maps/prismaMap';
import type { Nullable } from 'types/utilityTypes';
import type { Year } from 'types/nominations';
import { prismaContext } from 'lib/prisma';
import type { Context } from './prisma.types';

export const YEAR_TAG = 'year';
export const getYear = unstable_cache(
  async (year: number): Promise<Nullable<Year>> => {
    console.log(`Finding year ${year}`);
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
  { tags: [YEAR_TAG] }
);

export const YEARS_TAG = 'years';
export const getYears = unstable_cache(
  async (): Promise<Year[]> => {
    console.log('Getting years');
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
  },
  ['years'],
  { tags: [YEARS_TAG] }
);

export const connectCategoryToYear = async (
  category: string,
  year: number,
  ctx: Context
): Promise<boolean> => {
  console.log(`Connecting category ${category} to year ${year}`);
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
