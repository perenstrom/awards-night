import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { styled } from '@mui/material';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import {
  Category,
  Nomination,
  NormalizedCategories,
  NormalizedFilms,
  NormalizedNominations,
  NominationMeta,
  Year,
  NominationData,
  BetIcon,
  Player
} from 'types/nominations';
import { ParsedUrlQuery } from 'querystring';
//import { Category as CategoryComponent } from 'components/Category';
//import { CategoryMenu } from 'components/CategoryMenu';
//import { PlayerStandings } from 'components/PlayerStandings';
import { SetRecoilState, useRecoilState, useRecoilValue } from 'recoil';
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
import { useUser } from '@auth0/nextjs-auth0';
import { Nullable } from 'types/utilityTypes';
import { prismaContext } from 'lib/prisma';
import { getCategories, getYears } from 'services/prisma';

import { LeaderboardItem } from 'components/presentationMode/LeaderboardItem';
import { LeaderboardItemSmall } from 'components/presentationMode/LeaderboardItemSmall';
import { LeaderboardItemRest } from 'components/presentationMode/LeaderboardItemSmallRest';
import { NominatedFilm } from 'components/presentationMode/NominatedFilm';

const AREA_ID = 'nominations-area';

interface Size {
  width: number;
  height: number;
  restrictedBy: 'height' | 'width';
}

const MainWrapper = styled('div')`
  display: flex;
  height: 100%;
  width: 100%;
`;

const Sidebar = styled('div')`
  flex-basis: 20em;
  background: #363636;
  flex-grow: 0;
  border-right: 0.5px solid #696b7e;
  overflow: hidden;

  padding: 2em 1em 1em 1em;

  font-family: 'Inter', sans-serif;
`;

const Leaderboard = styled('ol')`
  margin: 0 0 0.5em 0;
  padding: 0;

  color: #ffffff;
  font-weight: 700;

  ol& {
    counter-reset: position;
  }

  & li {
    margin-bottom: 0;
    padding: 0.2em 0.5em;

    display: flex;
    gap: 0.5em;
    justify-content: space-between;
    align-items: baseline;

    overflow: hidden;

    font-size: 0.8em;
    border-radius: 0.5em;
  }
`;

const LeaderboardOverflow = styled('ol')`
  ol& {
    padding: 0;

    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 0.5em;

    font-size: 1em;
  }
`;

const Categories = styled('ul')`
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 0.8em;
  color: #e5e7f8;
  line-height: 1.5;
  margin: 0 0 0.5em 0;
  padding: 0;
  list-style: none;
`;

const CategoryItem = styled('li')`
  padding: 0;
  //color: #EF8B2C;
`;

const Main = styled('div')`
  background: linear-gradient(180deg, #24242e 0%, #111115 24.3%);
  flex-grow: 1;

  display: flex;
  flex-direction: column;
  flex-basis: 100%;
  padding: 3em;
  padding-top: 1em;
`;

const Heading = styled('h1')`
  font-family: 'Inter', sans-serif;
  font-weight: 300;
  font-size: 2.7em;
  color: #e5e7f8;
  margin: 0;
  padding-bottom: 0.2em;
`;

const SubHeading = styled('h2')`
  font-family: 'Inter', sans-serif;
  font-weight: 300;
  font-size: 1.7em;
  color: #e5e7f8;
  margin: 0;
  padding-bottom: 0.2em;
`;

const SubHeadingSmall = styled('h2')`
  font-family: 'Inter', sans-serif;
  font-weight: 300;
  font-size: 1.2em;
  color: #e5e7f8;
  margin: 1em 0 0.2em;
`;

const NominationsArea = styled('div')`
  height: 100%;
  font-size: 1em;
  gap: 1em;

  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  align-content: flex-start;
  justify-content: flex-start;
`;

const getNominationSize = (): Size | null => {
  if (typeof window !== 'undefined') {
    const $nominationsArea = document.getElementById(AREA_ID);

    if ($nominationsArea) {
      const emSize = parseInt(
        getComputedStyle($nominationsArea).fontSize.slice(0, -2),
        10
      );

      const nominationsAreaWidth = $nominationsArea.offsetWidth;
      const nominationsAreaHeight = $nominationsArea.offsetHeight;

      const contentWidth = nominationsAreaWidth - emSize;
      const contentHeight = nominationsAreaHeight - 2 * emSize;

      const contentRatio = contentWidth / contentHeight;
      const cardRatio = 3 / 2;

      const restrictedBy = contentRatio >= cardRatio ? 'height' : 'width';

      return {
        width: nominationsAreaWidth,
        height: nominationsAreaHeight,
        restrictedBy: restrictedBy
      };
    }
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

  const nominationSize = getNominationSize();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (nominationSize) {
      const timeOut = setTimeout(() => setVisible(true), 100);

      return () => clearTimeout(timeOut);
    }
  }, [nominationSize]);

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
  const categoryBetIds: number[] = categoryNominations.flatMap(
    (n) => nominationBets?.[n.id] || []
  );
  const categoryBets = bets
    ? Object.values(bets).filter((b) => categoryBetIds.includes(b.id))
    : [];

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

  const completedCategories = meta
    ? meta.completedCategories
    : initialMeta.completedCategories;

  // heigh: 16 / 800, width: 16 / 1200
  return (
    <>
      <Head>
        <title>{category.name}</title>
      </Head>
      <MainWrapper
        style={{
          fontSize: nominationSize?.restrictedBy === 'height' ? '2vh' : '1.2vw'
        }}
      >
        <Sidebar>
          <SubHeading>Leaderboard</SubHeading>
          <Leaderboard>
            {players.slice(0, 4).map((player) => (
              <LeaderboardItem
                key={player.id}
                name={player.name}
                correct={player.correct}
                total={completedCategories}
                itemStyle={player.style}
              />
            ))}
            {players.length > 4 && (
              <LeaderboardOverflow>
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
              </LeaderboardOverflow>
            )}
          </Leaderboard>
          <SubHeadingSmall>Completed categories</SubHeadingSmall>
          <Categories>
            <CategoryItem>Best Sound</CategoryItem>
            <CategoryItem>Best Visual Effects</CategoryItem>
            <CategoryItem>Best Animated Short</CategoryItem>
            <CategoryItem>Best Animated Feature</CategoryItem>
            <CategoryItem>Best Documentary</CategoryItem>
            <CategoryItem>Best Hair and Makeup</CategoryItem>
            <CategoryItem>Best Costume Design</CategoryItem>
            <CategoryItem>Best Production Design</CategoryItem>
            <CategoryItem>Best Live Action Short</CategoryItem>
            <CategoryItem>Best Actress</CategoryItem>
          </Categories>
          <SubHeadingSmall>Upcoming categories</SubHeadingSmall>
          <Categories>
            <CategoryItem>Best Actor</CategoryItem>
            <CategoryItem>Best Adapted Screenplay</CategoryItem>
            <CategoryItem>Best Cinematography</CategoryItem>
            <CategoryItem>Best Director</CategoryItem>
            <CategoryItem>Best Documentary Feature</CategoryItem>
            <CategoryItem>Best Film Editing</CategoryItem>
            <CategoryItem>Best International Film</CategoryItem>
            <CategoryItem>Best Original Score</CategoryItem>
            <CategoryItem>Best Original Screenplay</CategoryItem>
            <CategoryItem>Best Original Song</CategoryItem>
            <CategoryItem>Best Picture</CategoryItem>
            <CategoryItem>Best Supporting Actor</CategoryItem>
            <CategoryItem>Best Supporting Actress</CategoryItem>
          </Categories>
        </Sidebar>
        <Main>
          <Heading>{category.name}</Heading>
          <NominationsArea id={AREA_ID}>
            {categoryNominations.map((nomination) => (
              <NominatedFilm
                key={nomination.id}
                size={nominationSize}
                visible={visible}
                poster={films[nomination.film].poster}
                title={films[nomination.film].name}
                nominee={nomination.nominee}
                bets={prepareBets(nomination.id)}
              />
            ))}
          </NominationsArea>
        </Main>
      </MainWrapper>
      {/*       <GridContainer>
        <CategoryMenu category={category} year={year} />
        <CategoryComponent
          nominations={categoryNominations}
          films={films}
          bets={categoryBets}
          players={normalizedPlayers}
        />
        <PlayerStandings
          completedCategories={
            meta ? meta.completedCategories : initialMeta.completedCategories
          }
          players={players}
          bettingOpen={bettingOpen}
        />
      </GridContainer> */}
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
