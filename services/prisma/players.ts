import { prismaMap } from 'services/maps/prismaMap';
import { Player } from 'types/nominations';
import { Nullable } from 'types/utilityTypes';

import type { Context } from './prisma.types';

export const getPlayersWithBetsForGroup = async (
  group: number,
  ctx: Context
): Promise<Player[]> => {
  const result = await ctx.prisma.player.findMany({
    where: {
      groupId: group
    },
    include: {
      bets: true
    }
  });

  if (!result || result.length === 0) {
    return [];
  } else {
    return result.map((player) => prismaMap.playerWithBets.fromPrisma(player));
  }
};

export const getPlayersForGroup = async (
  group: number,
  ctx: Context
): Promise<Player[]> => {
  const result = await ctx.prisma.player.findMany({
    where: {
      groupId: group
    }
  });

  if (!result || result.length === 0) {
    return [];
  } else {
    return result.map((player) => prismaMap.player.fromPrisma(player));
  }
};

export const getPlayerByAuth0Id = async (
  auth0Id: string,
  ctx: Context
): Promise<Nullable<Player>> => {
  const result = await ctx.prisma.player.findUnique({
    where: {
      auth0UserId: auth0Id
    }
  });

  if (!result) {
    return null;
  } else {
    return prismaMap.player.fromPrisma(result);
  }
};
