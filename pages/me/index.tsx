import { GetStaticProps, NextPage } from 'next';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { Year } from 'types/nominations';
import React from 'react';
import { NominationListWrapper } from 'components/NominationListWrapper';
import Head from 'next/head';
import { getYears } from 'services/airtable';
import Link from 'next/link';

type Props = {
  years: Year[];
};

const DashboardPage: NextPage<Props> = ({ years }) => {
  return (
    <div>
      <Head>
        <title>Bets</title>
      </Head>
      <NominationListWrapper>
        <table>
          <thead>
            <tr>
              <th>Year</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {years.map((year) => (
              <tr>
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
      </NominationListWrapper>
    </div>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const years = await getYears();

  return {
    props: { years }
  };
};

export default withPageAuthRequired(DashboardPage);
