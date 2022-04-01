import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import {
  withPageAuthRequired,
  WithPageAuthRequiredProps
} from '@auth0/nextjs-auth0';
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
import Head from 'next/head';
import { getYears } from 'services/airtable';
import { ParsedUrlQuery } from 'querystring';
import { Typography, styled } from '@mui/material';
import { MainContainer } from 'components/MainContainer';
import { RequiredBy } from 'types/utilityTypes';
import Link from 'next/link';

const Loading = styled('span')`
  font-size: 1rem;
  font-weight: normal;
`;

type Props = NominationData;
type State = 'idle' | 'loading' | 'saving';

const DashboardPage: NextPage<Props> = ({
  year,
  categories,
  nominations,
  films
}) => {
  const [bets, setBets] = useState<Record<NominationId, BetId>>({});
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
    if (!player) {
      throw new Error('Trying to update bets for undefined player');
    }

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
      <MainContainer>
        <Link href={'/me'}>
          <a>&lt; Dashboard</a>
        </Link>
        <span> | </span>
        <Link href={`/${year.year}/${Object.values(categories)[0].slug}`}>
          <a>Go to presentation mode &gt;</a>
        </Link>
        <Typography variant="h1">
          {player && `Betting for ${player.name}`}
          {state !== 'idle' && <Loading> loading...</Loading>}
        </Typography>
        {!year.bettingOpen && <p>Betting is closed</p>}
        {(Object.values(categories) as Category[]).map((category) => (
          <div key={category.id}>
            <Typography variant="h2">{category.name}</Typography>
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
                    bettingOpen={year.bettingOpen}
                    onClick={state === 'idle' ? updateBet : () => null}
                  />
                );
              })}
            </CategoryBets>
          </div>
        ))}
      </MainContainer>
    </div>
  );
};

interface Params extends ParsedUrlQuery {
  year: string;
}

export const getStaticProps: GetStaticProps<Props, Params> = async (
  context
) => {
  const nominationData = await getNominationData(
    parseInt((context as RequiredBy<typeof context, 'params'>).params.year, 10)
  );
  if (!nominationData) {
    throw new Error('Error when fetching nomination data');
  }

  return {
    props: nominationData
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const years = await getYears();
  const paths = years.map((year) => ({
    params: { year: year.year.toString() }
  }));

  return {
    paths: paths,
    fallback: false
  };
};

export default withPageAuthRequired<Props & WithPageAuthRequiredProps>(
  DashboardPage
);
