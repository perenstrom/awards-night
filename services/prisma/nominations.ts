import { Nomination as PrismaNomination, Prisma } from '@prisma/client';
import { prismaMap } from 'services/maps/prismaMap';

import type { Nomination } from 'types/nominations';
import type { PartialBy } from 'types/utilityTypes';
import type { Context } from './prisma.types';

export const createNominations = async (
  nominations: PartialBy<Nomination, 'id'>[],
  ctx: Context
): Promise<boolean> => {
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

export const updateNomination = async (
  nominationId: number,
  nomination: Partial<PrismaNomination>,
  ctx: Context
): Promise<Nomination> => {
  try {
    const updatedNomination = await ctx.prisma.nomination.update({
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

/* export const updateNomination = async (
  nominationId: NominationId,
  nomination: Partial<NominationRecord>
): Promise<Nomination> => {
  console.log(
    `Updating nomination:\n${JSON.stringify(
      { nominationId, ...nomination },
      null,
      2
    )}`
  );

  return new Promise((resolve, reject) => {
    nominationsBase
      .update(nominationId, nomination)
      .then((result) => resolve(airtableMap.nomination.fromAirtable(result)))
      .catch((error) => {
        reject(error);
        console.error(error);
      });
  });
}; */
