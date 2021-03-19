import React from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import styled from 'styled-components';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import {
  getBets,
  getCategories,
  getCategory,
  getFilms,
  getNominations,
  getPlayers
} from 'services/nominations';
import {
  Category,
  Nomination,
  NormalizedBets,
  NormalizedFilms,
  NormalizedPlayers
} from 'types/nominations';
import { ParsedUrlQuery } from 'querystring';
import { Category as CategoryComponent } from 'components/Category';
import { CategoryMenu } from 'components/CategoryMenu';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: 50px auto 50px;
  justify-content: stretch;
  align-content: stretch;
  width: 100vw;
  height: 100vh;
`;

interface Props {
  category: Category;
  nominations: Nomination[];
  films: NormalizedFilms;
  bets: NormalizedBets;
  players: NormalizedPlayers;
}

interface Params extends ParsedUrlQuery {
  category: string;
}

const CategoryPage: NextPage<Props> = ({
  category,
  nominations,
  films,
  bets,
  players
}) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>{category.name}</title>
      </Head>
      <GridContainer>
        <CategoryMenu category={category} />
        <CategoryComponent
          nominations={nominations}
          films={films}
          bets={bets}
          players={players}
        />
        <pre>{JSON.stringify(players, null, 2)}</pre>
      </GridContainer>
    </div>
  );
};

export const getStaticProps: GetStaticProps<Props, Params> = async ({
  params
}) => {
  const category = await getCategory(params.category);
  const nominations = await getNominations(category.nominations);
  const films = await getFilms(nominations.map((n) => n.film));
  const normalizedFilms: NormalizedFilms = {};
  films.forEach((film) => (normalizedFilms[film.id] = film));
  const bets = await getBets(nominations.map((n) => n.bets).flat());
  const normalizedBets: NormalizedBets = {};
  bets.forEach((bet) => (normalizedBets[bet.id] = bet));
  const players = await getPlayers(bets.map((b) => b.player));
  const normalizedPlayers: NormalizedPlayers = {};
  players.forEach((player) => (normalizedPlayers[player.id] = player));

  return {
    props: {
      category,
      nominations,
      films: normalizedFilms,
      bets: normalizedBets,
      players: normalizedPlayers
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
