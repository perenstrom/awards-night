import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styled from 'styled-components';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import {
  getBets,
  getCategories,
  getYears,
  getPlayers as getPlayersFromAirtable
} from 'services/airtable';
import {
  Bet,
  Category,
  Nomination,
  NormalizedBets,
  NormalizedCategories,
  NormalizedFilms,
  NormalizedNominations,
  NormalizedPlayers,
  Player,
  PlayerId,
  NominationMeta,
  Year,
  NominationData
} from 'types/nominations';
import { ParsedUrlQuery } from 'querystring';
import { Category as CategoryComponent } from 'components/Category';
import { CategoryMenu } from 'components/CategoryMenu';
import { PlayerStandings } from 'components/PlayerStandings';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  betsState,
  categoriesState,
  nominationsState,
  normalizedCategoriesState,
  playerState,
  metaState
} from 'states/state';
import { getNominationData } from 'lib/getNominationData';

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
  meta: NominationMeta;
  bettingOpen: boolean;
}

const CategoryPage: NextPage<Props> = ({
  year,
  categories: initialCategories,
  nominations: initialNominations,
  films,
  bets: initialBets,
  players: initialPlayers,
  meta: initialMeta,
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
  const meta = useRecoilValue(metaState);
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
            meta
              ? meta.completedCategories
              : initialMeta.completedCategories
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

const getPlayers = async (
  bets: Bet[],
  bettingOpen: boolean
): Promise<NormalizedPlayers> => {
  if (!bettingOpen && bets.length > 0) {
    const players = await getPlayersFromAirtable(bets.map((b) => b.player));

    const rawNormalizedPlayers: NormalizedPlayers = {};
    players.forEach((player) => {
      rawNormalizedPlayers[player.id] = player;
    });
    return rawNormalizedPlayers;
  } else {
    return {};
  }
};

interface Params extends ParsedUrlQuery {
  year: string;
  category: string;
}
export const getStaticProps: GetStaticProps<Props, Params> = async (
  context
) => {
  const nominationData: NominationData = await getNominationData(parseInt(context.params.year, 10));
  const { year, categories, nominations, films, meta } = nominationData;

  const bets = await getBets(
    (Object.values(nominations) as Nomination[]).map((n) => n.bets).flat()
  );
  const normalizedBets: NormalizedBets = {};
  if (!year.bettingOpen) {
    bets.forEach((b) => {
      normalizedBets[b.id] = b;
      (nominations[b.nomination] as Nomination).bets.push(b.id);
    });
  }
  const players = await getPlayers(bets, year.bettingOpen);

  return {
    props: {
      year,
      categories,
      nominations,
      films,
      bets: normalizedBets,
      players,
      meta,
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
