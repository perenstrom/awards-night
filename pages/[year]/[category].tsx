import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styled from 'styled-components';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { getCategories, getYear, getYears } from 'services/airtable';
import {
  Category,
  Nomination,
  NormalizedBets,
  NormalizedCategories,
  NormalizedFilms,
  NormalizedNominations,
  NormalizedPlayers,
  Player,
  PlayerId,
  Status,
  Year
} from 'types/nominations';
import { ParsedUrlQuery } from 'querystring';
import { Category as CategoryComponent } from 'components/Category';
import { CategoryMenu } from 'components/CategoryMenu';
import { getYearData } from 'lib/getYearData';
import { PlayerStandings } from 'components/PlayerStandings';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  betsState,
  categoriesState,
  nominationsState,
  normalizedCategoriesState,
  playerState,
  statusState
} from 'states/state';

const GridContainer = styled.div`
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
  bets: NormalizedBets;
  players: NormalizedPlayers;
  status: Status;
  bettingOpen: boolean;
}

const CategoryPage: NextPage<Props> = ({
  year,
  categories: initialCategories,
  nominations: initialNominations,
  films,
  bets: initialBets,
  players: initialPlayers,
  status: initialStatus,
  bettingOpen
}) => {
  const router = useRouter();
  const { category: slug } = router.query;

  const [nominations, setNominations] = useRecoilState(nominationsState);
  const [bets, setBets] = useRecoilState(betsState);
  const [normalizedCategories, setNormalizedCategories] = useRecoilState(
    normalizedCategoriesState
  );
  const categories = useRecoilValue(categoriesState);
  const status = useRecoilValue(statusState);
  const [players, setPlayers] = useRecoilState<NormalizedPlayers>(playerState);
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

  useEffect(() => {
    initState(
      initialNominations,
      initialBets,
      initialPlayers,
      initialCategories
    );
  }, []);
  const initState = (
    initialNominations: NormalizedNominations,
    initialBets: NormalizedBets,
    initialPlayers: NormalizedPlayers,
    initialCategories: NormalizedCategories
  ) => {
    if (!nominations) {
      setNominations(initialNominations);
    }
    if (!bets) {
      setBets(initialBets);
    }
    if (!players) {
      setPlayers(initialPlayers);
    }
    if (!normalizedCategories) {
      setNormalizedCategories(initialCategories);
    }
  };

  useEffect(() => {
    if (!bettingOpen) {
      const interval = setInterval(refreshNominations, 10000);

      return () => clearInterval(interval);
    }
  }, []);
  const refreshNominations = () => {
    fetch(`/api/nominations?year=${year.year}`)
      .then((result) => result.json())
      .then(setNominations);
  };

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
          bets={bets ?? initialBets}
          players={players ?? initialPlayers}
        />
        <PlayerStandings
          completedCategories={
            status
              ? status.completedCategories
              : initialStatus.completedCategories
          }
          players={
            (Object.entries(players ?? initialPlayers) as [PlayerId, Player][])
              .map((p) => p[1])
              .sort((a, b) => a.correct - b.correct) as Player[]
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
  const year = await getYear(parseInt(context.params.year, 10));
  const categoryData = await getYearData(year);
  const {
    categories,
    nominations,
    films,
    bets,
    players,
    status
  } = categoryData;

  return {
    props: {
      year,
      categories,
      nominations,
      films,
      bets,
      players,
      status,
      bettingOpen: year.bettingOpen
    }
  };
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
