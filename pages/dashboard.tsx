import { GetStaticProps, NextPage } from 'next';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { getNominationData } from 'lib/getNominationData';
import {
  BetId,
  Category,
  NominationData,
  NominationId,
  Player
} from 'types/nominations';
import React, { useState, useEffect } from 'react';
import {
  createBet,
  deleteBet,
  getLoggedInPlayer,
  updateBet as updateBetApi,
  getBetsForPlayer
} from 'services/local';
import { BetItem } from 'components/BetItem';
import { CategoryBets } from 'components/CategoryBets';
import { CategoryHeading } from 'components/CategoryHeading';
import { NominationListWrapper } from 'components/NominationListWrapper';
import Head from 'next/head';
import styled from 'styled-components';

const Loading = styled.span`
  font-size: 1rem;
  font-weight: normal;
`;

type Props = NominationData & { bettingOpen: boolean };
type State = 'idle' | 'loading' | 'saving';

const DashboardPage: NextPage<Props> = ({
  categories,
  nominations,
  films,
  bettingOpen
}) => {
  return null;
  /* const [bets, setBets] = useState<Record<NominationId, BetId>>({});
  const [player, setPlayer] = useState<Player>();
  const [state, setState] = useState<State>('loading');
  useEffect(() => {
    const fetchDataAsync = async () => {
      const player = await getLoggedInPlayer();
      const bets = await getBetsForPlayer(player.id);
      setPlayer(player);
      setBets(bets);
      setState('idle');
    };
    fetchDataAsync();
  }, []);

  const updateBet = async (nominationId: NominationId, category: Category) => {
    setState('saving');
    const nominationsWithExistingBets = category.nominations.filter(
      (nominationId) => Object.keys(bets).includes(nominationId)
    );

    if (nominationsWithExistingBets.length > 1) {
      throw new Error('Multiple bets for one category');
    }

    if (nominationsWithExistingBets[0] === nominationId) {
      // Removing bet
      const existingBet = bets[nominationsWithExistingBets[0]] as BetId;
      await deleteBet(existingBet);
      const newBets = { ...bets };
      delete newBets[nominationsWithExistingBets[0]];
      setBets(newBets);
    } else if (nominationsWithExistingBets.length > 0) {
      // Updating bet in category
      const existingBet = bets[nominationsWithExistingBets[0]] as BetId;
      const updatedBet = await updateBetApi(existingBet, nominationId);
      const newBets = { ...bets };
      newBets[nominationId] = updatedBet.id;
      delete newBets[nominationsWithExistingBets[0]];
      setBets(newBets);
    } else {
      // First bet in category
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
          {player && `Betting for ${player.name}`}
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
  ); */
};

export const getStaticProps: GetStaticProps<{}> = async (context) => {
  return { props: {} };
  /* const bettingData = await getNominationData();

  return {
    props: {
      ...bettingData,
      bettingOpen: process.env.BETTING_OPEN === 'true'
    }
  }; */
};

export default withPageAuthRequired(DashboardPage);
