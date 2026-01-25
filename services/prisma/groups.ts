import { unstable_cache } from 'next/cache';
import prisma from 'lib/prisma';
import { Group, Player } from 'types/nominations';
import { prismaMap } from 'services/maps/prismaMap';

export const GROUP_BY_SLUG_CACHE_KEY = 'GROUP_BY_SLUG_CACHE_KEY';
export const GROUPS_FOR_PLAYER_CACHE_KEY = 'GROUPS_FOR_PLAYER_CACHE_KEY';
export const ALL_GROUPS_CACHE_KEY = 'ALL_GROUPS_CACHE_KEY';
export const ALL_PLAYERS_CACHE_KEY = 'ALL_PLAYERS_CACHE_KEY';

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

export const getAllGroups = unstable_cache(
  async (): Promise<Group[]> => {
    console.log('Finding all groups');
    const result = await prisma.group.findMany({
      include: {
        players: {
          include: {
            player: true
          }
        }
      }
    });

    return result.map((group) => prismaMap.group.fromPrisma(group));
  },
  [],
  { tags: [ALL_GROUPS_CACHE_KEY] }
);

export const getAllPlayers = unstable_cache(
  async (): Promise<Player[]> => {
    console.log('Finding all players');
    const result = await prisma.player.findMany({
      include: {
        groups: {
          include: {
            group: true
          }
        }
      }
    });

    return result.map((player) =>
      prismaMap.playerWithGroups.fromPrisma(player)
    );
  },
  [],
  { tags: [ALL_PLAYERS_CACHE_KEY] }
);

export const slugExists = async (slug: string): Promise<boolean> => {
  console.log(`Checking if slug exists: ${slug}`);
  const result = await prisma.group.findUnique({
    where: { slug }
  });
  return result !== null;
};

export const createGroup = async (
  name: string,
  slug: string
): Promise<Group> => {
  console.log(`Creating group with name: ${name}, slug: ${slug}`);

  // Check if slug already exists
  const exists = await slugExists(slug);
  if (exists) {
    throw new Error('A group with this slug already exists.');
  }

  const result = await prisma.group.create({
    data: {
      name,
      slug
    }
  });

  return prismaMap.group.fromPrisma(result);
};

export const addPlayerToGroup = async (
  playerId: number,
  groupId: number
): Promise<void> => {
  console.log(`Adding player ${playerId} to group ${groupId}`);

  // Check if player is already in the group
  const existing = await prisma.playerToGroup.findUnique({
    where: {
      playerId_groupId: {
        playerId,
        groupId
      }
    }
  });

  if (existing) {
    throw new Error('Player is already in this group.');
  }

  await prisma.playerToGroup.create({
    data: {
      playerId,
      groupId
    }
  });
};

export const removePlayerFromGroup = async (
  playerId: number,
  groupId: number
): Promise<void> => {
  console.log(`Removing player ${playerId} from group ${groupId}`);

  // Check how many groups the player is in
  const playerGroups = await prisma.playerToGroup.findMany({
    where: { playerId }
  });

  if (playerGroups.length <= 1) {
    throw new Error('Player must be in at least one group.');
  }

  await prisma.playerToGroup.delete({
    where: {
      playerId_groupId: {
        playerId,
        groupId
      }
    }
  });
};

export const deleteGroup = async (groupId: number): Promise<void> => {
  console.log(`Deleting group ${groupId}`);

  // Check if group is empty
  const groupMembers = await prisma.playerToGroup.findMany({
    where: { groupId }
  });

  if (groupMembers.length > 0) {
    throw new Error(
      'Cannot delete group with members. Remove all members first.'
    );
  }

  await prisma.group.delete({
    where: { id: groupId }
  });
};
