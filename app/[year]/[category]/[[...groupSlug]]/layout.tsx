import React from 'react';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { clsx } from 'clsx';
import Link from 'next/link';
import { auth0 } from 'lib/auth0';
import { NominationsWrapper } from 'components/presentationMode/NominationsWrapper';
import { getLoggedInPlayer } from 'lib/player';
import { BettingData } from 'types/nominations';
import { getBettingData, getBettingDataBySlug } from 'lib/getBettingData';
import { getNominationData } from 'lib/getNominationData';
import { getGroupsForPlayer } from 'services/prisma/groups';
import { LeaderboardItemSmall } from 'components/presentationMode/LeaderboardItemSmall';
import { LeaderboardItemRest } from 'components/presentationMode/LeaderboardItemSmallRest';
import { LeaderboardItem } from 'components/presentationMode/LeaderboardItem';
import { NominationsPoller } from 'components/presentationMode/NominationsPoller';
import { GroupSelector } from 'components/presentationMode/GroupSelector';
import styles from './layout.module.scss';

interface Props {
  params: Promise<{ year: string; category: string; groupSlug?: string[] }>;
}

export default async function CategoryLayout(
  props: Props & {
    children?: React.ReactNode;
  }
) {
  const session = await auth0.getSession();
  if (!session) redirect('/');

  const rawParams = await props.params;
  const params = z
    .object({
      year: z.string(),
      category: z.string(),
      groupSlug: z.array(z.string()).optional()
    })
    .safeParse(rawParams);

  if (params.success === false) redirect('/');

  const categorySlug = params.data.category;
  const groupSlug = params.data.groupSlug?.[0]; // Take the first segment as the group slug

  const player = await getLoggedInPlayer();
  if (!player) redirect('/');

  const nominationData = await getNominationData(
    parseInt(params.data.year, 10)
  );
  if (!nominationData) redirect('/');
  const { year, categories: normalizedCategories } = nominationData;

  // Get player's groups
  const playerGroups = await getGroupsForPlayer(player.id);
  if (playerGroups.length === 0) redirect('/');

  // Determine which group to use
  let selectedGroup = playerGroups[0]; // Default to first group
  let bettingData: BettingData;

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

  const { players } = bettingData;
  const playersSortedByCorrect = players.sort((a, b) => b.correct - a.correct);
  const bettingOpen = year.bettingOpen;

  const completedCategoriesCount = nominationData.meta.completedCategories;
  const categories = Object.values(normalizedCategories);
  const completedCategories = categories
    .filter((category) => category.decided)
    .sort((a, b) => a.name.localeCompare(b.name));
  const upcomingCategories = categories
    .filter((category) => !category.decided)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <NominationsPoller
      bettingOpen={year.bettingOpen}
      awardsFinished={year.awardsFinished}
    >
      <NominationsWrapper>
        <div className={styles.sidebar}>
          <div className={styles.sidebarContent}>
            {!!players.length && (
              <>
                <h2 className={styles.subHeading}>
                  {bettingOpen ? 'Players' : 'Leaderboard'}
                </h2>
                <ol className={styles.leaderboard}>
                  {bettingOpen ? (
                    <>
                      <ol className={styles.leaderboardOverflow}>
                        {players.slice(0, 18).map((player) => (
                          <LeaderboardItemSmall
                            key={player.id}
                            name={player.name}
                            correct={0}
                            itemStyle={player.style}
                            showScore={false}
                          />
                        ))}
                        {players.length > 18 ? (
                          <LeaderboardItemRest />
                        ) : (
                          players.length === 18 && (
                            <LeaderboardItemSmall
                              name={players[18].name}
                              correct={0}
                              itemStyle={players[18].style}
                              showScore={false}
                            />
                          )
                        )}
                      </ol>
                    </>
                  ) : (
                    <>
                      {playersSortedByCorrect
                        .slice(0, 4)
                        .map((player, index) => (
                          <LeaderboardItem
                            key={player.id}
                            name={player.name}
                            correct={player.correct}
                            total={completedCategoriesCount}
                            itemStyle={player.style}
                            place={index + 1}
                          />
                        ))}
                      {playersSortedByCorrect.length > 4 && (
                        <ol className={styles.leaderboardOverflow}>
                          {playersSortedByCorrect.slice(4, 9).map((player) => (
                            <LeaderboardItemSmall
                              key={player.id}
                              name={player.name}
                              correct={player.correct}
                              itemStyle={player.style}
                            />
                          ))}
                          {playersSortedByCorrect.length > 10 ? (
                            <LeaderboardItemRest />
                          ) : (
                            playersSortedByCorrect.length === 10 && (
                              <LeaderboardItemSmall
                                name={playersSortedByCorrect[9].name}
                                correct={playersSortedByCorrect[9].correct}
                                itemStyle={playersSortedByCorrect[9].style}
                              />
                            )
                          )}
                        </ol>
                      )}
                    </>
                  )}
                </ol>
              </>
            )}
            {!!completedCategories.length && (
              <>
                <h2 className={styles.subHeadingSmall}>Completed categories</h2>
                <ul className={styles.categories}>
                  {completedCategories.map((category) => (
                    <li
                      className={clsx(styles.categoryItem, {
                        [styles.active]: categorySlug === category.slug
                      })}
                      key={category.slug}
                    >
                      <Link
                        href={`/${year.year}/${category.slug}${
                          groupSlug ? `/${groupSlug}` : ''
                        }`}
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {!!upcomingCategories.length && (
              <>
                <h2 className={styles.subHeadingSmall}>Upcoming categories</h2>
                <ul className={styles.categories}>
                  {upcomingCategories.map((category) => (
                    <li
                      className={clsx(styles.categoryItem, {
                        [styles.active]: categorySlug === category.slug
                      })}
                      key={category.slug}
                    >
                      <Link
                        href={`/${year.year}/${category.slug}${
                          groupSlug ? `/${groupSlug}` : ''
                        }`}
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          {playerGroups.length > 1 && (
            <GroupSelector
              groups={playerGroups}
              year={year.year}
              category={categorySlug}
            />
          )}
        </div>
        {props.children}
      </NominationsWrapper>
    </NominationsPoller>
  );
}
