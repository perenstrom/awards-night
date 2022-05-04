import { prismaMap } from 'services/maps/prismaMap';

import type { Nomination } from 'types/nominations';
import type { Context } from './prisma.types';

export const getNominations = async (
  nominations: number[],

  ctx: Context
): Promise<Nomination[]> => {
  const result = await ctx.prisma.nomination.findMany({
    where: {
      id: { in: nominations }
    }
  });

  if (result.length === 0) {
    return [];
  } else {
    return result.map((nom) => prismaMap.nomination.fromPrisma(nom));
  }
};
