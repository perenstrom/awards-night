import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { getPlayers } from 'services/airtable';
import { NominationData, Category, Player } from 'types/nominations';
import { getNominationData } from 'lib/getNominationData';
import {
  createBet,
  getBetsForPlayer,
  updateBet as updateBetApi
} from 'services/local';
import styled from 'styled-components';
import { BetItem } from 'components/BetItem';
import { CategoryBets } from 'components/CategoryBets';
import { CategoryHeading } from 'components/CategoryHeading';
import { NominationListWrapper } from 'components/NominationListWrapper';

const Loading = styled.span`
  font-size: 1rem;
  font-weight: normal;
`;

type Props = NominationData & { bettingOpen: boolean } & { player: Player };

interface Params extends ParsedUrlQuery {
  player: string;
}

type State = 'idle' | 'loading' | 'saving';

const PlayerBettingPage: NextPage<Props> = ({
  player,
  categories,
  nominations,
  films,
  bettingOpen
}) => {
  const [bets, setBets] = useState<Record<string, string>>({});
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
    setState('saving');
    const nominationsWithExistingBets = category.nominations.filter(
      (nominationId) => Object.keys(bets).includes(nominationId)
    );

    if (nominationsWithExistingBets.length > 1) {
      throw new Error('Multiple bets for one category');
    }

    if (nominationsWithExistingBets[0]) {
      const existingBet = bets[nominationsWithExistingBets[0]];
      const updatedBet = await updateBetApi(existingBet, nominationId);
      const newBets = { ...bets };
      newBets[nominationId] = updatedBet.id;
      delete newBets[nominationsWithExistingBets[0]];
      setBets(newBets);
    } else {
      const savedBet = await createBet(player.id, nominationId);
      setBets({ ...bets, [nominationId]: savedBet.id });
    }

    setState('idle');
  };

  return (
    <div>
      <Head>
        <title>Bets</title>
      </Head>
      <NominationListWrapper>
        <h1>
          Betting for {player.name}
          {state !== 'idle' && <Loading> loading...</Loading>}
        </h1>
        {!bettingOpen && <p>Betting is closed</p>}
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
                    won={nomination.won}
                    decided={nomination.decided}
                    filmName={films[nomination.film].name}
                    poster={films[nomination.film].poster}
                    nominee={nomination.nominee}
                    activeBet={Object.keys(bets).includes(nomination.id)}
                    bettingOpen={bettingOpen}
                    onClick={state === 'idle' ? updateBet : () => null}
                  />
                );
              })}
            </CategoryBets>
          </div>
        ))}
      </NominationListWrapper>
    </div>
  );
};

export const getStaticProps: GetStaticProps<Props, Params> = async (
  context
) => {
  const bettingData = await getNominationData();
  const player = await getPlayers([context.params.player]);

  return {
    props: {
      ...bettingData,
      player: player[0],
      bettingOpen: process.env.BETTING_OPEN === 'true'
    }
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

export default PlayerBettingPage;
