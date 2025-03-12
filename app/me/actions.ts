'use server';

import { revalidateTag, unstable_cache } from 'next/cache';
import { getLoggedInPlayer } from 'lib/player';
import {
  BETS_FOR_NOMINATIONS_CACHE_KEY,
  BETS_FOR_PLAYER_CACHE_KEY,
  createBet,
  deleteBet,
  getBetsForPlayer,
  updateBet
} from 'services/prisma/bets';
import { PLAYERS_WITH_BETS_CACHE_KEY } from 'services/prisma/players';
import { getNomination } from 'services/prisma/nominations';
import { getCategoryWithNominationsForYear } from 'services/prisma/categories';
import {
  CATEGORIES_CACHE_KEY,
  NOMINATIONS_CACHE_KEY
} from 'lib/getNominationData';

const getNominationCached = unstable_cache(getNomination, [], {
  tags: [NOMINATIONS_CACHE_KEY]
});
const getCategoryWithNominationsForYearCached = unstable_cache(
  getCategoryWithNominationsForYear,
  [],
  { tags: [NOMINATIONS_CACHE_KEY, CATEGORIES_CACHE_KEY] }
);

export const setBet = async (formData: FormData) => {
  const player = await getLoggedInPlayer();
  if (!player) return;

  const rawNominationId = formData.get('nominationId') as string;
  if (!rawNominationId) return;
  const nominationId = parseInt(rawNominationId, 10);

  const year = formData.get('year') as string;
  if (!year) return;

  const nomination = await getNominationCached(nominationId);
  if (!nomination) return;

  const category = await getCategoryWithNominationsForYearCached(
    nomination.category,
    parseInt(year, 10)
  );
  if (!category) return;

  const allBets = await getBetsForPlayer(player.id, parseInt(year, 10));

  const nominationIdsInCategory = category.nominations.map((n) => n.id);
  const betsInCurrentCategory = allBets.filter((b) =>
    nominationIdsInCategory.includes(b.nomination)
  );

  if (betsInCurrentCategory.length > 1) {
    throw new Error('Multiple bets in one category');
  }

  const currentBet =
    betsInCurrentCategory.length === 1 ? betsInCurrentCategory[0] : null;

  if (currentBet && currentBet.nomination === nominationId) {
    // Clicked nomination already predicted as winner
    // Removing bet
    await deleteBet(currentBet.id);
  } else if (currentBet && currentBet.nomination !== nominationId) {
    // Clicked nomination when another already predicted as winner
    // Updating bet in category

    await updateBet(currentBet.id, nominationId);
  } else {
    // First bet in category
    await createBet({
      player: player.id,
      nomination: nominationId
    });
  }

  revalidateTag(PLAYERS_WITH_BETS_CACHE_KEY);
  revalidateTag(BETS_FOR_PLAYER_CACHE_KEY);
  revalidateTag(BETS_FOR_NOMINATIONS_CACHE_KEY);
};
