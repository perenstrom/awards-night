import { Prisma } from '@prisma/client';
import { prismaMap } from 'services/maps/prismaMap';
import { Bet } from 'types/nominations';
import { Nullable, PartialBy } from 'types/utilityTypes';
import { Context } from './prisma.types';

export const createBet = async (
  bet: PartialBy<Bet, 'id'>,
  ctx: Context
): Promise<Nullable<Bet>> => {
  const formattedBet = prismaMap.bet.toPrisma(bet);

  const result = await ctx.prisma.bet.create({
    data: formattedBet
  });

  if (result) {
    return prismaMap.bet.fromPrisma(result);
  } else {
    return null;
  }
};

export const getBets = async (bets: number[], ctx: Context): Promise<Bet[]> => {
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
};

export const getBet = async (
  bet: number,
  ctx: Context
): Promise<Nullable<Bet>> => {
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
};

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

export const getBetsForPlayer = async (
  playerId: number,
  ctx: Context
): Promise<Bet[]> => {
  const result = await ctx.prisma.bet.findMany({
    where: {
      playerId: playerId
    }
  });

  if (!result || result.length === 0) {
    return [];
  } else {
    return result.map((bet) => prismaMap.bet.fromPrisma(bet));
  }
};

export const updateBet = async (
  betId: number,
  nominationId: number,
  ctx: Context
): Promise<Bet> => {
  try {
    const updatedBet = await ctx.prisma.bet.update({
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

export const deleteBet = async (
  betId: number,
  ctx: Context
): Promise<boolean> => {
  try {
    const deletedBet = await ctx.prisma.bet.delete({
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
