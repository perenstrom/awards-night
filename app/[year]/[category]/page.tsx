import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { clsx } from 'clsx';
import Link from 'next/link';
import { getNominationData } from 'lib/getNominationData';
import { BetIcon, BettingData, Nomination } from 'types/nominations';
import { LeaderboardItem } from 'components/presentationMode/LeaderboardItem';
import { LeaderboardItemSmall } from 'components/presentationMode/LeaderboardItemSmall';
import { LeaderboardItemRest } from 'components/presentationMode/LeaderboardItemSmallRest';
import { NominatedFilm } from 'components/presentationMode/NominatedFilm';
import { NominationsWrapper } from 'components/presentationMode/NominationsWrapper';
import { getLoggedInPlayer } from 'lib/player';
import { getBettingData } from 'lib/getBettingData';
import { normalizeBets, normalizePlayers } from 'utils/normalizer';
import { NominationsPoller } from 'components/presentationMode/NominationsPoller';
import styles from './category.module.scss';

interface Props {
  params: Promise<{ year: string; category: string }>;
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
      category: z.string()
    })
    .safeParse(rawParams);

  if (params.success === false) redirect('/');

  const categorySlug = params.data.category;

  const nominationData = await getNominationData(
    parseInt(params.data.year, 10)
  );
  if (!nominationData) redirect('/');
  const {
    year,
    films,
    categories: normalizedCategories,
    nominations: normalizedNominations
  } = nominationData;
  const category = normalizedCategories[params.data.category];

  const categoryNominations: Nomination[] = category.nominations.map(
    (n) => normalizedNominations[n]
  );

  const player = await getLoggedInPlayer();
  const bettingData: BettingData = player
    ? await getBettingData(nominationData, player.group || 0)
    : {
        bets: [],
        players: [],
        nominationBets: {}
      };

  const { players, bets, nominationBets } = bettingData;
  const bettingOpen = year.bettingOpen;
  const normalizedPlayers = normalizePlayers(players);
  const normalizedBets = normalizeBets(bets);
  const playersSortedByCorrect = players.sort((a, b) => b.correct - a.correct);

  const prepareBets = (nominationId: number): BetIcon[] => {
    if (!normalizedPlayers || !normalizedBets || !nominationBets) {
      return [];
    }

    const betsForNomination = nominationBets[nominationId]
      ? nominationBets[nominationId].map((betId) => normalizedBets[betId])
      : [];

    const betIconData: BetIcon[] = betsForNomination.map((bet) => ({
      id: `${normalizedPlayers[bet.player].name}-${
        normalizedPlayers[bet.player].id
      }`,
      letter: normalizedPlayers[bet.player].name[0],
      style: normalizedPlayers[bet.player].style
    }));

    return betIconData;
  };

  const categories = Object.values(nominationData.categories);
  const completedCategories = categories
    .filter((category) => category.decided)
    .sort((a, b) => a.name.localeCompare(b.name));
  const upcomingCategories = categories
    .filter((category) => !category.decided)
    .sort((a, b) => a.name.localeCompare(b.name));
  const completedCategoriesCount = nominationData.meta.completedCategories;

  return (
    <NominationsPoller bettingOpen={year.bettingOpen}>
      <NominationsWrapper>
        <div className={styles.sidebar}>
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
                    {playersSortedByCorrect.slice(0, 4).map((player, index) => (
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
                    <Link href={`/${year.year}/${category.slug}`}>
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
                    <Link href={`/${year.year}/${category.slug}`}>
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
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
      </NominationsWrapper>
    </NominationsPoller>
  );
}
