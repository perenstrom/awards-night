import { unstable_cache } from 'next/cache';
import prisma from 'lib/prisma';
import { Group } from 'types/nominations';
import { prismaMap } from 'services/maps/prismaMap';

export const GROUP_BY_SLUG_CACHE_KEY = 'GROUP_BY_SLUG_CACHE_KEY';
export const GROUPS_FOR_PLAYER_CACHE_KEY = 'GROUPS_FOR_PLAYER_CACHE_KEY';

export const getGroupBySlug = unstable_cache(
  async (slug: string): Promise<Group | null> => {
    console.log(`Finding group with slug ${slug}`);
    const result = await prisma.group.findUnique({
      where: {
        slug: slug
      }
    });

    if (!result) {
      return null;
    } else {
      return prismaMap.group.fromPrisma(result);
    }
  },
  [],
  { tags: [GROUP_BY_SLUG_CACHE_KEY] }
);

export const getGroupsForPlayer = unstable_cache(
  async (playerId: number): Promise<Group[]> => {
    console.log(`Finding groups for player ${playerId}`);
    const result = await prisma.player.findUnique({
      where: {
        id: playerId
      },
      include: {
        groups: {
          include: {
            group: true
          }
        }
      }
    });

    if (!result || !result.groups) {
      return [];
    } else {
      return result.groups.map((playerGroup) =>
        prismaMap.group.fromPrisma(playerGroup.group)
      );
    }
  },
  [],
  { tags: [GROUPS_FOR_PLAYER_CACHE_KEY] }
);
