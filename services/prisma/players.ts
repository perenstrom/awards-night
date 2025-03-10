import { cache } from 'react';
import { prismaMap } from 'services/maps/prismaMap';
import { Player } from 'types/nominations';
import { Nullable } from 'types/utilityTypes';
import prisma from 'lib/prisma';

export const getPlayersWithBetsForGroup = async (
  group: number
): Promise<Player[]> => {
  console.log(`Finding players with bets for group ${group}`);
  const result = await prisma.player.findMany({
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

export const getPlayerWithBets = cache(
  async (playerId: number): Promise<Player | null> => {
    console.log(`Finding player with bets for player ${playerId}`);
    const result = await prisma.player.findUnique({
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
  }
);

export const getPlayerByAuth0Id = cache(
  async (auth0Id: string): Promise<Nullable<Player>> => {
    console.log(`Finding player with auth0id ${auth0Id}`);
    const result = await prisma.player.findUnique({
      where: {
        auth0UserId: auth0Id
      }
    });

    if (!result) {
      return null;
    } else {
      return prismaMap.player.fromPrisma(result);
    }
  }
);
