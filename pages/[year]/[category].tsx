import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { styled } from '@mui/material';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { getCategories, getYears } from 'services/airtable';
import {
  Category,
  Nomination,
  NormalizedCategories,
  NormalizedFilms,
  NormalizedNominations,
  Player,
  NominationMeta,
  Year,
  NominationData,
  BetId
} from 'types/nominations';
import { ParsedUrlQuery } from 'querystring';
import { Category as CategoryComponent } from 'components/Category';
import { CategoryMenu } from 'components/CategoryMenu';
import { PlayerStandings } from 'components/PlayerStandings';
import { SetRecoilState, useRecoilState, useRecoilValue } from 'recoil';
import {
  betsState,
  categoriesState,
  nominationsState,
  normalizedCategoriesState,
  playerState,
  metaState,
  nominationBetsState
} from 'states/state';
import { getNominationData } from 'lib/getNominationData';
import { getBettingData, getLoggedInPlayer } from 'services/local';
import { useUser } from '@auth0/nextjs-auth0';

const GridContainer = styled('div')`
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: 50px auto 66px;
  justify-content: stretch;
  align-content: stretch;
  width: 100vw;
  height: 100vh;
`;

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

  const [nominations, setNominations] = useRecoilState(nominationsState);
  const normalizedCategories = useRecoilValue(normalizedCategoriesState);
  const categories = useRecoilValue(categoriesState);
  const meta = useRecoilValue(metaState);

  const [bets, setBets] = useRecoilState(betsState);
  const [players, setPlayers] = useRecoilState(playerState);
  const [nominationBets, setNominationBets] =
    useRecoilState(nominationBetsState);

  const { user } = useUser();
  useEffect(() => {
    const fetchDataAsync = async () => {
      if (user) {
        try {
          const player = await getLoggedInPlayer();
          const bettingData = await getBettingData({
            categories: initialCategories,
            nominations: initialNominations,
            playerId: player.id,
            year: year
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
    initialCategories,
    initialNominations,
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
    nominations ? nominations[n] : initialNominations[n]
  );
  const categoryBetIds: BetId[] = categoryNominations.flatMap(
    (n) => nominationBets?.[n.id] || []
  );
  const categoryBets = bets
    ? Object.values(bets).filter((b) => categoryBetIds.includes(b.id))
    : [];

  const refreshNominations = useCallback(() => {
    fetch(`/api/nominations?year=${year.year}`)
      .then((result) => result.json())
      .then(setNominations);
  }, [setNominations, year.year]);
  useEffect(() => {
    if (!bettingOpen) {
      const interval = setInterval(refreshNominations, 10000);

      return () => clearInterval(interval);
    }
  }, [bettingOpen, refreshNominations]);

  return (
    <div>
      <Head>
        <title>{category.name}</title>
      </Head>
      <GridContainer>
        <CategoryMenu category={category} year={year} />
        <CategoryComponent
          nominations={categoryNominations}
          films={films}
          bets={categoryBets}
          players={players}
        />
        <PlayerStandings
          completedCategories={
            meta ? meta.completedCategories : initialMeta.completedCategories
          }
          players={
            players
              ? (Object.values(players).sort(
                  (a, b) => a.correct - b.correct
                ) as Player[])
              : []
          }
          bettingOpen={bettingOpen}
        />
      </GridContainer>
    </div>
  );
};

interface Params extends ParsedUrlQuery {
  year: string;
  category: string;
}
export const getStaticProps: GetStaticProps<Props, Params> = async (
  context
) => {
  const nominationData: NominationData = await getNominationData(
    parseInt(context.params.year, 10)
  );
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
  set(nominationsState, nominations);
  set(normalizedCategoriesState, categories);
};

export const getStaticPaths: GetStaticPaths = async () => {
  const years = await getYears();

  const paths = [];
  for (const year of years) {
    const categories = await getCategories(year.categories);
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
