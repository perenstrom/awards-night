import { unstable_cache } from 'next/cache';
import { prismaMap } from 'services/maps/prismaMap';
import { Player } from 'types/nominations';
import { Nullable } from 'types/utilityTypes';
import { prismaContext } from 'lib/prisma';
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

export const PLAYER_WITH_BETS_TAG = 'playerWithBets';
export const getPlayerWithBets = unstable_cache(
  async (playerId: number): Promise<Player | null> => {
    const result = await prismaContext.prisma.player.findUnique({
      where: {
        id: playerId
      },
      include: {
        bets: true
      }
    });

    if (!result) {
      return null;
    } else {
      return prismaMap.playerWithBets.fromPrisma(result);
    }
  },
  ['playerWithBets'],
  { tags: [PLAYER_WITH_BETS_TAG] }
);

export const getPlayerByAuth0Id = async (
  auth0Id: string
): Promise<Nullable<Player>> => {
  console.log(`Finding player with auth0id ${auth0Id}`);
  const result = await prismaContext.prisma.player.findUnique({
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
