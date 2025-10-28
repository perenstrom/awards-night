import { unstable_cache } from 'next/cache';
import {
  ALL_GROUPS_CACHE_KEY,
  ALL_PLAYERS_CACHE_KEY,
  getAllGroups,
  getAllPlayers
} from 'services/prisma/groups';
import { GroupAdminClient } from './GroupAdminClient';

const getCachedGroups = unstable_cache(async () => getAllGroups(), [], {
  tags: [ALL_GROUPS_CACHE_KEY]
});

const getCachedPlayers = unstable_cache(async () => getAllPlayers(), [], {
  tags: [ALL_PLAYERS_CACHE_KEY]
});

export const GroupAdmin = async () => {
  const groups = await getCachedGroups();
  const players = await getCachedPlayers();

  return <GroupAdminClient groups={groups} players={players} />;
};
