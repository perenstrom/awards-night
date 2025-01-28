import { Nomination as PrismaNomination, Prisma } from '@prisma/client';
import { unstable_cache } from 'next/cache';
import { prismaMap } from 'services/maps/prismaMap';
import type { Nomination } from 'types/nominations';
import type { PartialBy } from 'types/utilityTypes';
import { prismaContext } from 'lib/prisma';
import type { Context } from './prisma.types';

export const createNominations = async (
  nominations: PartialBy<Nomination, 'id'>[],
  ctx: Context
): Promise<boolean> => {
  console.log('Creating nominations');
  const formattedNominations = nominations.map(prismaMap.nomination.toPrisma);

  const result = await ctx.prisma.nomination.createMany({
    data: formattedNominations
  });

  if (result.count > 0) {
    return true;
  } else {
    return false;
  }
};

export const NOMINATIONS_TAG = 'nominations';
export const getNominations = unstable_cache(
  async (nominations: number[]): Promise<Nomination[]> => {
    console.log('Finding nominations');
    const result = await prismaContext.prisma.nomination.findMany({
      where: {
        id: { in: nominations }
      }
    });

    if (result.length === 0) {
      return [];
    } else {
      return result.map((nom) => prismaMap.nomination.fromPrisma(nom));
    }
  },
  ['nominations'],
  { tags: [NOMINATIONS_TAG] }
);

export const updateNomination = async (
  nominationId: number,
  nomination: Partial<PrismaNomination>
): Promise<Nomination> => {
  console.log('Updating nomination');
  try {
    const updatedNomination = await prismaContext.prisma.nomination.update({
      where: {
        id: nominationId
      },
      data: nomination
    });

    return prismaMap.nomination.fromPrisma(updatedNomination);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(error.message);
    }
    throw error;
  }
};
