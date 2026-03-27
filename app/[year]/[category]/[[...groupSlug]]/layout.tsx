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
        <div className="flex basis-[20em] grow-0 flex-col overflow-hidden border-r-[0.5px] border-solid border-[#696b7e] bg-[#363636] px-4 pb-4 pt-8 font-[Inter,sans-serif]">
          <div className="flex flex-1 flex-col">
            {!!players.length && (
              <>
                <h2 className="m-0 pb-[0.2em] font-[Inter,sans-serif] text-[1.7em] font-light text-text-primary">
                  {bettingOpen ? 'Players' : 'Leaderboard'}
                </h2>
                <ol className="mb-[0.5em] p-0 font-bold text-white [&_li]:flex [&_li]:items-baseline [&_li]:justify-between [&_li]:gap-[0.5em] [&_li]:overflow-hidden [&_li]:rounded-lg [&_li]:px-[0.5em] [&_li]:py-[0.2em] [&_li]:text-[0.8em] [&_ol]:[counter-reset:position]">
                  {bettingOpen ? (
                    <>
                      <ol className="grid grid-cols-3 gap-[0.5em] p-0 text-base">
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
                        <ol className="grid grid-cols-3 gap-[0.5em] p-0 text-base">
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
                <h2 className="mx-0 mb-[0.2em] mt-4 font-[Inter,sans-serif] text-[1.2em] font-light text-text-primary">
                  Completed categories
                </h2>
                <ul className="mx-0 mb-[0.5em] mt-0 list-none p-0 font-[Inter,sans-serif] text-[0.8em] font-medium leading-normal text-text-primary">
                  {completedCategories.map((category) => (
                    <li className="p-0" key={category.slug}>
                      <Link
                        className={clsx(
                          'no-underline',
                          categorySlug === category.slug
                            ? 'text-[#ef8b2c]'
                            : 'text-text-primary'
                        )}
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
                <h2 className="mx-0 mb-[0.2em] mt-4 font-[Inter,sans-serif] text-[1.2em] font-light text-text-primary">
                  Upcoming categories
                </h2>
                <ul className="mx-0 mb-[0.5em] mt-0 list-none p-0 font-[Inter,sans-serif] text-[0.8em] font-medium leading-normal text-text-primary">
                  {upcomingCategories.map((category) => (
                    <li className="p-0" key={category.slug}>
                      <Link
                        className={clsx(
                          'no-underline',
                          categorySlug === category.slug
                            ? 'text-[#ef8b2c]'
                            : 'text-text-primary'
                        )}
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
