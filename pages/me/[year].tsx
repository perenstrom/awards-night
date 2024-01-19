import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { getNominationData } from 'lib/getNominationData';
import { Bet, Category, NominationData, Player } from 'types/nominations';
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
import { ParsedUrlQuery } from 'querystring';
import { Typography, styled } from '@mui/material';
import { MainContainer } from 'components/MainContainer';
import { RequiredBy } from 'types/utilityTypes';
import Link from 'next/link';
import { prismaContext } from 'lib/prisma';
import { getYears } from 'services/prisma';

const Loading = styled('span')`
  font-size: 1rem;
  font-weight: normal;
`;

type Props = NominationData;
type State = 'idle' | 'loading' | 'saving';

const getBetForNomination = (bets: Bet[], nominationId: number) => {
  const filteredBets = bets.filter((bet) => bet.nomination === nominationId);

  if (filteredBets.length > 1) {
    throw new Error('More than one bet for the requested nomination');
  } else if (filteredBets.length === 0) {
    return null;
  } else {
    return filteredBets[0];
  }
};

const DashboardPage: NextPage<Props> = ({
  year,
  categories,
  nominations,
  films
}) => {
  const [bets, setBets] = useState<Bet[]>([]);
  const [player, setPlayer] = useState<Player>();
  const [state, setState] = useState<State>('loading');
  useEffect(() => {
    const fetchDataAsync = async () => {
      const playerResult = await getLoggedInPlayer();
      if (!playerResult.success) {
        console.log(playerResult.error);
        setState('idle');
        return;
      }

      const bets = await getBetsForPlayer(playerResult.data.id);
      setPlayer(playerResult.data);
      setBets(bets);
      setState('idle');
    };
    fetchDataAsync();
  }, []);

  const updateBet = async (nominationId: number, category: Category) => {
    if (!player) {
      throw new Error('Trying to update bets for undefined player');
    }

    setState('saving');
    const nominationsWithExistingBets = category.nominations.filter(
      (nominationId) => bets.map((b) => b.nomination).includes(nominationId)
    );

    if (nominationsWithExistingBets.length > 1) {
      throw new Error('Multiple bets for one category');
    }

    if (nominationsWithExistingBets[0] === nominationId) {
      // Removing bet
      const existingBet = getBetForNomination(
        bets,
        nominationsWithExistingBets[0]
      );
      if (!existingBet) {
        throw new Error('No bet found');
      }
      await deleteBet(existingBet.id);
      const newBets = bets.filter((bet) => bet.id !== existingBet.id);
      setBets(newBets);
    } else if (nominationsWithExistingBets.length > 0) {
      // Updating bet in category
      const existingBet = getBetForNomination(
        bets,
        nominationsWithExistingBets[0]
      );
      if (!existingBet) {
        throw new Error('No bet found');
      }
      const updatedBet = await updateBetApi(existingBet.id, nominationId);
      const newBets = bets.filter((bet) => bet.id !== existingBet.id);
      newBets.push(updatedBet);
      setBets(newBets);
    } else {
      // First bet in category
      const savedBet = await createBet(player.id, nominationId);
      const newBets = [...bets];
      newBets.push(savedBet);
      setBets(newBets);
    }

    setState('idle');
  };

  return (
    <div>
      <Head>
        <title>Bets</title>
      </Head>
      <MainContainer>
        <Link href={'/me'}>&lt; Dashboard</Link>
        <span> | </span>
        <Link href={`/${year.year}/${Object.values(categories)[0].slug}`}>
          Go to presentation mode &gt;
        </Link>
        <Typography variant="h1">
          {player && `Betting for ${player.name}`}
          {state !== 'idle' && <Loading> loading...</Loading>}
        </Typography>
        {!year.bettingOpen && <p>Betting is closed</p>}
        {(Object.values(categories) as Category[]).map((category) => (
          <div key={category.slug}>
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
                    activeBet={!!getBetForNomination(bets, nomination.id)}
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
    parseInt((context as RequiredBy<typeof context, 'params'>).params.year, 10),
    prismaContext
  );
  if (!nominationData) {
    throw new Error('Error when fetching nomination data');
  }

  return {
    props: nominationData
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const years = await getYears(prismaContext);
  const paths = years.map((year) => ({
    params: { year: year.year.toString() }
  }));

  return {
    paths: paths,
    fallback: false
  };
};

export default withPageAuthRequired<Props>(DashboardPage);
