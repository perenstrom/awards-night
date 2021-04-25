import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styled from 'styled-components';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { getCategories } from 'services/airtable';
import {
  Category,
  CategoryId,
  Nomination,
  NormalizedBets,
  NormalizedCategories,
  NormalizedFilms,
  NormalizedNominations,
  NormalizedPlayers,
  Player,
  PlayerId,
  Status
} from 'types/nominations';
import { ParsedUrlQuery } from 'querystring';
import { Category as CategoryComponent } from 'components/Category';
import { CategoryMenu } from 'components/CategoryMenu';
import { getCategoryData } from 'lib/getCategoryData';
import { PlayerStandings } from 'components/PlayerStandings';
import { calculateWinnings } from 'utils/nominations';

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
  bettingOpen: boolean;
}

const CategoryPage: NextPage<Props> = ({
  categories,
  nominations: initialNominations,
  films,
  bets,
  players: initialPlayers,
  status: initialStatus,
  bettingOpen
}) => {
  const router = useRouter();
  const { category: slug } = router.query;
  const category = categories[(slug as string) ?? Object.keys(categories)[0]];

  const [nominations, setNominations] = useState<NormalizedNominations>(
    initialNominations
  );
  const [players, setPlayers] = useState<NormalizedPlayers>(initialPlayers);
  const [status, setStatus] = useState<Status>(initialStatus);

  const categoryNominations: Nomination[] = category.nominations.map((n) =>
    nominations ? nominations[n] : initialNominations[n]
  );

  useEffect(() => {
    if (!bettingOpen) {
      const interval = setInterval(refreshNominations, 10000);

      return () => clearInterval(interval);
    }
  }, []);

  const refreshNominations = () => {
    fetch('/api/nominations')
      .then((result) => result.json())
      .then(prepareNewNominationData);
  };

  const prepareNewNominationData = (nominations: NormalizedNominations) => {
    const { players: normalizedPlayers, status } = calculateWinnings(
      (Object.entries(categories) as [CategoryId, Category][]).map((c) => c[1]),
      nominations,
      bets,
      (Object.entries(players) as [PlayerId, Player][]).map((p) => p[1])
    );
    setNominations(nominations);
    setPlayers(normalizedPlayers);
    setStatus(status);
    console.log('updated');
  };

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
          players={players ?? initialPlayers}
        />
        <PlayerStandings
          completedCategories={
            status?.completedCategories ?? initialStatus.completedCategories
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
  category: string;
}
export const getStaticProps: GetStaticProps<Props, Params> = async () => {
  const categoryData = await getCategoryData(
    process.env.BETTING_OPEN === 'true'
  );
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
      status,
      bettingOpen: process.env.BETTING_OPEN === 'true'
    }
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const categories = await getCategories();

  const indexPath = {
    params: { category: [] }
  };
  const paths = categories.map((category) => ({
    params: { category: [category.slug] }
  }));

  return {
    paths: [...paths, indexPath],
    fallback: false
  };
};

export default CategoryPage;
