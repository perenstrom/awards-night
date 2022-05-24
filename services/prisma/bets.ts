import { prismaMap } from 'services/maps/prismaMap';
import { Bet } from 'types/nominations';
import { Context } from './prisma.types';

export const getBetsForNominations = async (
  nominations: number[],
  ctx: Context
): Promise<Bet[]> => {
  const result = await ctx.prisma.bet.findMany({
    where: {
      nominationId: { in: nominations }
    }
  });

  if (!result || result.length === 0) {
    return [];
  } else {
    return result.map((bet) => prismaMap.bet.fromPrisma(bet));
  }
};
