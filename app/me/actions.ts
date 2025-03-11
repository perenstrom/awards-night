'use server';

import { revalidatePath } from 'next/cache';
import { getNominationData } from 'lib/getNominationData';
import { getLoggedInPlayer } from 'lib/player';
import {
  createBet,
  deleteBet,
  getBetsForPlayer,
  updateBet
} from 'services/prisma/bets';
import { getBetForNomination } from 'utils/nominations';

export const setBet = async (formData: FormData) => {
  const player = await getLoggedInPlayer();
  if (!player) return;

  const rawNominationId = formData.get('nominationId') as string;
  if (!rawNominationId) return;
  const nominationId = parseInt(rawNominationId, 10);

  const year = formData.get('year') as string;
  if (!year) return;

  const nominationData = await getNominationData(parseInt(year, 10));
  if (!nominationData) return;

  const nomination = nominationData.nominations[nominationId];
  const category = nominationData.categories[nomination.category];

  const bets = await getBetsForPlayer(player.id, parseInt(year, 10));

  const nominationsWithExistingBets = category.nominations.filter(
    (nominationId) => bets.map((b) => b.nomination).includes(nominationId)
  );

  if (nominationsWithExistingBets.length > 1) {
    throw new Error('Multiple bets for one category');
  }

  if (nominationsWithExistingBets[0] === nominationId) {
    // Clicked nomination already predicted as winner
    // Removing bet
    const existingBet = getBetForNomination(
      bets,
      nominationsWithExistingBets[0]
    );
    if (!existingBet) {
      throw new Error('No bet found');
    }

    await deleteBet(existingBet.id);
  } else if (nominationsWithExistingBets.length > 0) {
    // Clicked nomination when another already predicted as winner
    // Updating bet in category
    const existingBet = getBetForNomination(
      bets,
      nominationsWithExistingBets[0]
    );
    if (!existingBet) {
      throw new Error('No bet found');
    }

    await updateBet(existingBet.id, nominationId);
  } else {
    // First bet in category
    await createBet({
      player: player.id,
      nomination: nominationId
    });
  }

  //console.log('revalidating');
  //revalidatePath('/me/[year]', 'page');
};
