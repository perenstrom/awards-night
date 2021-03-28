import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { getPlayers } from 'services/airtable';
import { Bet, BettingData, Category } from 'types/nominations';
import { getBettingData } from 'lib/getBettingData';
import {
  createBet,
  getBetsForPlayer,
  updateBet as updateBetApi
} from 'services/local';
import styled from 'styled-components';
import { BetItem } from 'components/BetItem';

const Loading = styled.span`
  font-size: 1rem;
  font-weight: normal;
`;

const Wrapper = styled.div`
  padding: 2rem;
  max-width: 50rem;
  margin-left: auto;
  margin-right: auto;
`;

const CategoryBets = styled.ul`
  padding: 0;
`;

const CategoryHeading = styled.h2`
  padding-top: 2rem;
`;

type Props = BettingData;

interface Params extends ParsedUrlQuery {
  player: string;
}

type State = 'idle' | 'loading';

const CategoryPage: NextPage<Props> = ({
  player,
  categories,
  nominations,
  films
}) => {
  const [bets, setBets] = useState<string[]>([]);
  const [state, setState] = useState<State>('loading');
  useEffect(() => {
    const fetchDataAsync = async () => {
      const bets = await getBetsForPlayer(player.id);
      setBets(bets);
      setState('idle');
    };
    fetchDataAsync();
  }, []);

  const updateBet = async (nominationId: string, category: Category) => {
    const nominationsWithExistingBets = category.nominations.filter(
      (nomination) => nominations[nomination].bets.length > 0
    );
    if (nominationsWithExistingBets.length > 1) {
      throw new Error('Multiple bets for one category');
    }

    if (nominationsWithExistingBets[0]) {
      const existingBet = nominations[nominationsWithExistingBets[0]].bets[0];
      const updatedBet = await updateBetApi(existingBet, nominationId);
    } else {
      const savedBet = await createBet(player.id, nominationId);
    }
  };

  return (
    <div>
      <Head>
        <title>Bets</title>
      </Head>
      <Wrapper>
        <h1>
          Betting for {player.name}
          {state !== 'idle' && <Loading> loading...</Loading>}
        </h1>
        {categories.map((category) => (
          <div key={category.id}>
            <CategoryHeading>{category.name}</CategoryHeading>
            <CategoryBets>
              {category.nominations.map((nominationId) => {
                const nomination = nominations[nominationId];
                return (
                  <BetItem
                    key={nomination.id}
                    category={category}
                    nominationId={nomination.id}
                    filmName={films[nomination.film].name}
                    poster={films[nomination.film].poster}
                    nominee={nomination.nominee}
                    activeBet={bets.includes(nomination.id)}
                    updateBet={updateBet}
                  />
                );
              })}
            </CategoryBets>
          </div>
        ))}
      </Wrapper>
    </div>
  );
};

export const getStaticProps: GetStaticProps<Props, Params> = async (
  context
) => {
  const bettingData = await getBettingData(context.params.player);

  return {
    props: bettingData
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const players = await getPlayers(null);

  const paths = players.map((player) => ({
    params: { player: player.id }
  }));

  return {
    paths: paths,
    fallback: false
  };
};

export default CategoryPage;
