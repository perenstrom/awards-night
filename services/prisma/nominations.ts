import { Nomination as PrismaNomination, Prisma } from '@prisma/client';
import { cache } from 'react';
import { prismaMap } from 'services/maps/prismaMap';
import type { Nomination } from 'types/nominations';
import type { PartialBy } from 'types/utilityTypes';
import prisma from 'lib/prisma';

export const createNominations = async (
  nominations: PartialBy<Nomination, 'id'>[]
): Promise<boolean> => {
  console.log('Creating nominations');
  const formattedNominations = nominations.map(prismaMap.nomination.toPrisma);

  const result = await prisma.nomination.createMany({
    data: formattedNominations
  });

  if (result.count > 0) {
    return true;
  } else {
    return false;
  }
};

export const getNomination = cache(
  async (nomination: number): Promise<Nomination | null> => {
    console.log('Finding single nomination: ', nomination);
    const result = await prisma.nomination.findUnique({
      where: {
        id: nomination
      }
    });

    if (result) {
      return prismaMap.nomination.fromPrisma(result);
    } else {
      return null;
    }
  }
);

export const getNominations = cache(
  async (nominations: number[]): Promise<Nomination[]> => {
    console.log('Finding nominations');
    const result = await prisma.nomination.findMany({
      where: {
        id: { in: nominations }
      }
    });

    if (result.length === 0) {
      return [];
    } else {
      return result.map((nom) => prismaMap.nomination.fromPrisma(nom));
    }
  }
);

export const updateNomination = async (
  nominationId: number,
  nomination: Partial<PrismaNomination>
): Promise<Nomination> => {
  console.log('Updating nomination');
  try {
    const updatedNomination = await prisma.nomination.update({
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
