import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { clsx } from 'clsx';
import { getNominationData } from 'lib/getNominationData';
import { BetIcon, BettingData, Nomination } from 'types/nominations';
import { NominatedFilm } from 'components/presentationMode/NominatedFilm';
import { getLoggedInPlayer } from 'lib/player';
import { getBettingData, getBettingDataBySlug } from 'lib/getBettingData';
import { getGroupsForPlayer } from 'services/prisma/groups';
import { normalizeBets, normalizePlayers } from 'utils/normalizer';
import styles from './category.module.scss';

interface Props {
  params: Promise<{ year: string; category: string; groupSlug?: string[] }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  return {
    title: `Nominations for ${params.year} - ${params.category}`
  };
}

export default async function Page(props: Props) {
  const rawParams = await props.params;
  const params = z
    .object({
      year: z.string(),
      category: z.string(),
      groupSlug: z.array(z.string()).optional()
    })
    .safeParse(rawParams);

  if (params.success === false) redirect('/');

  const nominationData = await getNominationData(
    parseInt(params.data.year, 10)
  );
  if (!nominationData) redirect('/');
  const {
    films,
    categories: normalizedCategories,
    nominations: normalizedNominations
  } = nominationData;
  const category = normalizedCategories[params.data.category];

  const categoryNominations: Nomination[] = category.nominations.map(
    (n) => normalizedNominations[n]
  );

  const player = await getLoggedInPlayer();
  if (!player) redirect('/');

  // Get player's groups
  const playerGroups = await getGroupsForPlayer(player.id);
  if (playerGroups.length === 0) redirect('/');

  // Determine which group to use
  let selectedGroup = playerGroups[0]; // Default to first group
  let bettingData: BettingData;

  const groupSlug = params.data.groupSlug?.[0]; // Take the first segment as the group slug

  if (groupSlug) {
    // Check if player belongs to the requested group
    const requestedGroup = playerGroups.find((g) => g.slug === groupSlug);
    if (!requestedGroup) {
      // Player doesn't belong to this group, redirect to default
      redirect(`/${params.data.year}/${params.data.category}`);
    }
    selectedGroup = requestedGroup;
    bettingData = await getBettingDataBySlug(nominationData, groupSlug);
  } else {
    // No group slug provided, use first group
    bettingData = await getBettingData(nominationData, selectedGroup.id);
  }

  const { players, bets, nominationBets } = bettingData;
  const normalizedPlayers = normalizePlayers(players);
  const normalizedBets = normalizeBets(bets);

  const prepareBets = (nominationId: number): BetIcon[] => {
    if (!normalizedPlayers || !normalizedBets || !nominationBets) {
      return [];
    }

    const betsForNomination = nominationBets[nominationId]
      ? nominationBets[nominationId].map((betId) => normalizedBets[betId])
      : [];

    const betIconData: BetIcon[] = betsForNomination
      .filter((bet) => normalizedPlayers[bet.player]) // Filter out bets for players not in current group
      .map((bet) => ({
        id: `${normalizedPlayers[bet.player].name}-${
          normalizedPlayers[bet.player].id
        }`,
        letter: normalizedPlayers[bet.player].name[0],
        style: normalizedPlayers[bet.player].style
      }));

    return betIconData;
  };

  return (
    <div className={styles.main}>
      <h1 className={styles.heading}>{category.name}</h1>
      <div
        className={clsx(styles.nominationsArea, {
          [styles.largeNomination]: categoryNominations.length <= 6
        })}
      >
        {categoryNominations.map((nomination) => (
          <NominatedFilm
            key={nomination.id}
            poster={films[nomination.film].poster}
            title={films[nomination.film].name}
            nominee={nomination.nominee}
            bets={prepareBets(nomination.id)}
            won={nomination.won}
          />
        ))}
      </div>
    </div>
  );
}
