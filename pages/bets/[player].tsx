import React from 'react';
import Head from 'next/head';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { getPlayers } from 'services/airtable';
import { BettingData, Category } from 'types/nominations';
import { getBettingData } from 'lib/getBettingData';
import { createBet, updateBet as updateBetApi } from 'services/local';

type Props = BettingData;

interface Params extends ParsedUrlQuery {
  player: string;
}

const CategoryPage: NextPage<Props> = ({
  player,
  categories,
  nominations,
  films
}) => {
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
      <h1>Betting for {player.name}</h1>
      {categories.map((category) => (
        <div key={category.id}>
          <h2>{category.name}</h2>
          <ul>
            {category.nominations.map((nominationId) => {
              const nomination = nominations[nominationId];
              return (
                <li
                  onClick={() => updateBet(nomination.id, category)}
                  key={nominationId}
                >
                  {films[nomination.film].name}
                  {nomination.nominee ? <i> – {nomination.nominee}</i> : ''}
                  {nomination.bets.length > 0 && (
                    <ul>
                      <li>This is your bet!</li>
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
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
