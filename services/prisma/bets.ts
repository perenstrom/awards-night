import { Prisma } from '@prisma/client';
import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { prismaMap } from 'services/maps/prismaMap';
import { Bet } from 'types/nominations';
import { Nullable, PartialBy } from 'types/utilityTypes';
import prisma from 'lib/prisma';
import { Context } from './prisma.types';

export const createBet = async (
  bet: PartialBy<Bet, 'id'>
): Promise<Nullable<Bet>> => {
  console.log('Creating bet');
  const formattedBet = prismaMap.bet.toPrisma(bet);

  const result = await prisma.bet.create({
    data: formattedBet
  });

  if (result) {
    return prismaMap.bet.fromPrisma(result);
  } else {
    return null;
  }
};

export const getBets = cache(
  async (bets: number[], ctx: Context): Promise<Bet[]> => {
    console.log('Finding bets');
    const result = await ctx.prisma.bet.findMany({
      where: {
        id: { in: bets }
      }
    });

    if (!result || result.length === 0) {
      return [];
    } else {
      return result.map((bet) => prismaMap.bet.fromPrisma(bet));
    }
  }
);

export const getBet = cache(
  async (bet: number, ctx: Context): Promise<Nullable<Bet>> => {
    console.log(`Finding bet with id ${bet}`);
    const betResult = await ctx.prisma.bet.findUnique({
      where: {
        id: bet
      }
    });

    if (!betResult) {
      return null;
    } else {
      return prismaMap.bet.fromPrisma(betResult);
    }
  }
);

export const BETS_FOR_NOMINATIONS_CACHE_KEY = 'BETS_FOR_NOMINATIONS_CACHE_KEY';
export const getBetsForNominations = unstable_cache(
  cache(async (nominations: number[]): Promise<Bet[]> => {
    console.log('Finding bets for nominations');

    const result = await prisma.bet.findMany({
      where: {
        nominationId: { in: nominations }
      }
    });

    if (!result || result.length === 0) {
      return [];
    } else {
      return result.map((bet) => prismaMap.bet.fromPrisma(bet));
    }
  }),
  [],
  { tags: [BETS_FOR_NOMINATIONS_CACHE_KEY] }
);

export const BETS_FOR_PLAYER_CACHE_KEY = 'BETS_FOR_PLAYER_CACHE_KEY';
export const getBetsForPlayer = unstable_cache(
  cache(async (playerId: number, year?: number): Promise<Bet[]> => {
    console.log(
      'Finding bets for player id: ' + playerId + ' and year: ' + year
    );

    const result = year
      ? await prisma.bet.findMany({
          where: {
            playerId: playerId,
            nomination: {
              yearId: year
            }
          }
        })
      : await prisma.bet.findMany({
          where: {
            playerId: playerId
          }
        });

    if (!result || result.length === 0) {
      return [];
    } else {
      return result.map((bet) => prismaMap.bet.fromPrisma(bet));
    }
  }),
  [],
  { tags: [BETS_FOR_PLAYER_CACHE_KEY] }
);

export const updateBet = async (
  betId: number,
  nominationId: number
): Promise<Bet> => {
  console.log(`Updating bet with id ${betId} to nomination ${nominationId}`);
  try {
    const updatedBet = await prisma.bet.update({
      where: {
        id: betId
      },
      data: {
        nomination: {
          connect: {
            id: nominationId
          }
        }
      }
    });

    return prismaMap.bet.fromPrisma(updatedBet);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(error.message);
    }
    throw error;
  }
};

export const deleteBet = async (betId: number): Promise<boolean> => {
  console.log(`Deleting bet with id ${betId}`);
  try {
    const deletedBet = await prisma.bet.delete({
      where: {
        id: betId
      }
    });

    if (deletedBet) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(error.message);
    }
    throw error;
  }
};
