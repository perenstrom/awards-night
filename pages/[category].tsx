import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styled from 'styled-components';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { getCategories } from 'services/nominations';
import {
  Nomination,
  NormalizedBets,
  NormalizedCategories,
  NormalizedFilms,
  NormalizedNominations,
  NormalizedPlayers,
  Status
} from 'types/nominations';
import { ParsedUrlQuery } from 'querystring';
import { Category as CategoryComponent } from 'components/Category';
import { CategoryMenu } from 'components/CategoryMenu';
import { getCategoryData } from 'lib/getCategoryData';
import { PlayerStandings } from 'components/PlayerStandings';

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
  categories: NormalizedCategories;
  nominations: NormalizedNominations;
  films: NormalizedFilms;
  bets: NormalizedBets;
  players: NormalizedPlayers;
  status: Status;
}

interface Params extends ParsedUrlQuery {
  category: string;
}

const CategoryPage: NextPage<Props> = ({
  categories,
  nominations,
  films,
  bets,
  players,
  status
}) => {
  const router = useRouter();
  const { category: slug } = router.query;
  const category = categories[slug as string];
  const categoryNominations: Nomination[] = category.nominations.map(
    (n) => nominations[n]
  );
  console.log(status);

  return (
    <div>
      <Head>
        <title>{category.name}</title>
      </Head>
      <GridContainer>
        <CategoryMenu category={category} />
        <CategoryComponent
          nominations={categoryNominations}
          films={films}
          bets={bets}
          players={players}
        />
        <PlayerStandings
          completedCategories={status.completedCategories}
          players={Object.entries(players)
            .map((p) => p[1])
            .sort((a, b) => a.correct - b.correct)}
        />
      </GridContainer>
    </div>
  );
};

export const getStaticProps: GetStaticProps<Props, Params> = async () => {
  const categoryData = await getCategoryData();
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
      categories,
      nominations,
      films,
      bets,
      players,
      status
    }
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const categories = await getCategories();

  const paths = categories.map((category) => ({
    params: { category: category.slug }
  }));

  return {
    paths: paths,
    fallback: false
  };
};

export default CategoryPage;
