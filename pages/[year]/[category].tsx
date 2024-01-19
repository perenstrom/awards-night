import { ParsedUrlQuery } from 'querystring';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { SetRecoilState, useRecoilState, useRecoilValue } from 'recoil';
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import { clsx } from 'clsx';
import {
  Category,
  Nomination,
  NormalizedCategories,
  NormalizedFilms,
  NormalizedNominations,
  NominationMeta,
  Year,
  NominationData,
  BetIcon
} from 'types/nominations';
import {
  betsState,
  categoriesState,
  normalizedNominationsState,
  normalizedCategoriesState,
  playerState,
  metaState,
  nominationBetsState,
  normalizedPlayersState,
  nominationsState,
  normalizedBetsState
} from 'states/state';
import { getNominationData } from 'lib/getNominationData';
import {
  getBettingData,
  getLoggedInPlayer,
  getNominations
} from 'services/local';
import { Nullable } from 'types/utilityTypes';
import { prismaContext } from 'lib/prisma';
import { getCategories, getYears } from 'services/prisma';
import { LeaderboardItem } from 'components/presentationMode/LeaderboardItem';
import { LeaderboardItemSmall } from 'components/presentationMode/LeaderboardItemSmall';
import { LeaderboardItemRest } from 'components/presentationMode/LeaderboardItemSmallRest';
import { NominatedFilm } from 'components/presentationMode/NominatedFilm';
import styles from './[category].module.scss';

const AREA_ID = 'nominations-area';

type RestrictedBy = 'height' | 'width';

const getRestrictedBy = (): RestrictedBy | null => {
  if (typeof window !== 'undefined') {
    const windowRatio = window.innerWidth / window.innerHeight;
    const targetContentRatio = 61 / 40;

    const restrictedBy = windowRatio >= targetContentRatio ? 'height' : 'width';

    return restrictedBy;
  }

  return null;
};

interface Props {
  year: Year;
  categories: NormalizedCategories;
  nominations: NormalizedNominations;
  films: NormalizedFilms;
  meta: NominationMeta;
  bettingOpen: boolean;
}

const CategoryPage: NextPage<Props> = ({
  year,
  categories: initialCategories,
  nominations: initialNominations,
  films,
  meta: initialMeta,
  bettingOpen
}) => {
  const router = useRouter();
  const { category: slug } = router.query;

  const [restrictedBy, setRestrictedBy] =
    useState<Nullable<RestrictedBy>>(null);
  useEffect(() => {
    setRestrictedBy(getRestrictedBy());
  }, []);

  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (restrictedBy) {
      const timeOut = setTimeout(() => setVisible(true), 100);

      return () => clearTimeout(timeOut);
    }
  }, [restrictedBy]);

  // Nomination data
  const [nominations, setNominations] = useRecoilState(nominationsState);
  if (!nominations.length) {
    setNominations(Object.values(initialNominations));
  }
  const normalizedNominations = useRecoilValue(normalizedNominationsState);

  const [categories, setCategories] = useRecoilState(categoriesState);
  if (!categories.length) {
    setCategories(Object.values(initialCategories));
  }
  const normalizedCategories = useRecoilValue(normalizedCategoriesState);

  const meta = useRecoilValue(metaState);

  // Bet data
  const [bets, setBets] = useRecoilState(betsState);
  const normalizedBets = useRecoilValue(normalizedBetsState);
  const [players, setPlayers] = useRecoilState(playerState);
  const normalizedPlayers = useRecoilValue(normalizedPlayersState);
  const [nominationBets, setNominationBets] =
    useRecoilState(nominationBetsState);

  const { user } = useUser();
  useEffect(() => {
    const fetchDataAsync = async () => {
      if (
        user &&
        normalizedCategories &&
        normalizedNominations &&
        !bets.length
      ) {
        try {
          const player = await getLoggedInPlayer();
          if (!player.success) {
            throw new Error(player.error.message);
          }

          const bettingData = await getBettingData({
            nominationData: {
              year,
              categories: normalizedCategories,
              nominations: normalizedNominations,
              films,
              meta
            },
            group: player.data.group || 0,
            playerId: player.data.id
          });

          setBets(bettingData.bets);
          setPlayers(bettingData.players);
          setNominationBets(bettingData.nominationBets);
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchDataAsync();
  }, [
    bets.length,
    films,
    meta,
    normalizedCategories,
    normalizedNominations,
    setBets,
    setNominationBets,
    setPlayers,
    user,
    year
  ]);

  const currentSlug =
    (slug as string) ??
    categories[0]?.slug ??
    Object.keys(initialCategories)[0];
  const category: Category = normalizedCategories
    ? normalizedCategories[currentSlug]
    : initialCategories[currentSlug];
  const categoryNominations: Nomination[] = category.nominations.map((n) =>
    normalizedNominations ? normalizedNominations[n] : initialNominations[n]
  );

  const refreshNominations = useCallback(async () => {
    const nominationsResult = await getNominations(year.year);

    if (nominationsResult.success) {
      setNominations(nominationsResult.data);
    }
  }, [setNominations, year.year]);
  useEffect(() => {
    if (!bettingOpen) {
      const interval = setInterval(refreshNominations, 10000);

      return () => clearInterval(interval);
    }
  }, [bettingOpen, refreshNominations]);

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

  const completedCategories = categories
    .filter((category) => category.decided)
    .sort((a, b) => a.name.localeCompare(b.name));
  const upcomingCategories = categories
    .filter((category) => !category.decided)
    .sort((a, b) => a.name.localeCompare(b.name));
  const completedCategoriesCount = meta
    ? meta.completedCategories
    : initialMeta.completedCategories;

  return (
    <>
      <Head>
        <title>{category.name}</title>
      </Head>
      <div
        className={clsx(styles.mainWrapper, {
          [styles.heightRestricted]: restrictedBy === 'height' || null,
          [styles.widthRestricted]: restrictedBy === 'width'
        })}
      >
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
                    {players.slice(0, 4).map((player) => (
                      <LeaderboardItem
                        key={player.id}
                        name={player.name}
                        correct={player.correct}
                        total={completedCategoriesCount}
                        itemStyle={player.style}
                      />
                    ))}
                    {players.length > 4 && (
                      <ol className={styles.leaderboardOverflow}>
                        {players.slice(4, 9).map((player) => (
                          <LeaderboardItemSmall
                            key={player.id}
                            name={player.name}
                            correct={player.correct}
                            itemStyle={player.style}
                          />
                        ))}
                        {players.length > 10 ? (
                          <LeaderboardItemRest />
                        ) : (
                          players.length === 10 && (
                            <LeaderboardItemSmall
                              name={players[9].name}
                              correct={players[9].correct}
                              itemStyle={players[9].style}
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
                      [styles.active]: slug === category.slug
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
                      [styles.active]: slug === category.slug
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
            id={AREA_ID}
            className={clsx(styles.nominationsArea, {
              [styles.largeNomination]: categoryNominations.length <= 6
            })}
          >
            {categoryNominations.map((nomination) => (
              <NominatedFilm
                key={nomination.id}
                visible={visible}
                poster={films[nomination.film].poster}
                title={films[nomination.film].name}
                nominee={nomination.nominee}
                bets={prepareBets(nomination.id)}
                won={nomination.won}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

interface Params extends ParsedUrlQuery {
  year: string;
  category: string;
}
export const getStaticProps: GetStaticProps<Props, Params> = async (
  context
) => {
  if (!context.params?.year) {
    throw new Error('Page called without year param');
  }

  const nominationData: Nullable<NominationData> = await getNominationData(
    parseInt(context.params.year, 10),
    prismaContext
  );
  if (!nominationData) {
    throw new Error('Error when fetching nomination data');
  }
  const { year, categories, nominations, films, meta } = nominationData;

  return {
    props: {
      year,
      categories,
      nominations,
      films,
      meta,
      bettingOpen: year.bettingOpen
    }
  };
};

export const route = '/[year]/[category]';
export const initializeRecoilState = (
  set: SetRecoilState,
  pageProps: Props
) => {
  const { nominations, categories } = pageProps;

  set(nominationsState, Object.values(nominations));
  set(categoriesState, Object.values(categories));
};

export const getStaticPaths: GetStaticPaths = async () => {
  const years = await getYears(prismaContext);

  const paths = [];
  for (const year of years) {
    const categories = await getCategories(year.categories, prismaContext);
    paths.push(
      categories.map((category) => ({
        params: { year: year.year.toString(), category: category.slug }
      }))
    );
  }

  return {
    paths: paths.flat(),
    fallback: false
  };
};

export default CategoryPage;
