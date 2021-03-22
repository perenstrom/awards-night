import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styled from 'styled-components';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { getPlayers } from 'services/nominations';
import { BettingData } from 'types/nominations';
import { getBettingData } from 'lib/getBettingData';

type Props = BettingData;

interface Params extends ParsedUrlQuery {
  player: string;
}

const CategoryPage: NextPage<Props> = ({
  player,
  categories,
  nominations,
  films,
  bets
}) => {
  return (
    <div>
      <Head>
        <title>Bets</title>
      </Head>
      <h1>Betting for {player.name}</h1>
      <ul>
        {categories.map((category) => (
          <>
            <li>
              {category.name}
              <ul>
                {category.nominations.map((nominationId) => {
                  const nomination = nominations[nominationId];
                  return (
                    <li>
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
            </li>
          </>
        ))}
      </ul>
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
