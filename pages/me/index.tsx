import { GetStaticProps, NextPage } from 'next';
import {
  withPageAuthRequired,
  WithPageAuthRequiredProps
} from '@auth0/nextjs-auth0';
import { Year } from 'types/nominations';
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { MainContainer } from 'components/MainContainer';
import { getYears } from 'services/prisma';
import { prismaContext } from 'lib/prisma';

interface Props {
  years: Year[];
}

const DashboardPage: NextPage<Props> = ({ years }) => {
  return (
    <div>
      <Head>
        <title>Bets</title>
      </Head>
      <MainContainer>
        <table>
          <thead>
            <tr>
              <th>Year</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {years.map((year) => (
              <tr key={year.year}>
                <td>
                  <Link href={`/me/${year.year}`}>
                    <a>{year.year}</a>
                  </Link>
                </td>
                <td>{year.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </MainContainer>
    </div>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const years = await getYears(prismaContext);

  return {
    props: { years }
  };
};

export default withPageAuthRequired<Props & WithPageAuthRequiredProps>(
  DashboardPage
);
