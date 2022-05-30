import { prismaMap } from 'services/maps/prismaMap';

import type { Nullable } from 'types/utilityTypes';
import type { Year } from 'types/nominations';
import type { Context } from './prisma.types';

export const getYear = async (
  year: number,
  ctx: Context
): Promise<Nullable<Year>> => {
  const result = await ctx.prisma.year.findUnique({
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
};

export const getYears = async (ctx: Context): Promise<Year[]> => {
  const result = await ctx.prisma.year.findMany({
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
