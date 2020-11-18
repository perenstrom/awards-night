import React from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { getNominations } from 'services/nominations';
import { NextPage } from 'next';
import { Nomination } from 'types/nominations';

interface Props {
  nominations: Nomination[];
}

const Home: NextPage<Props> = ({ nominations }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <pre>{JSON.stringify(nominations, null, 2)}</pre>
    </div>
  );
};

export async function getServerSideProps() {
  const nominations = await getNominations();

  return { props: { nominations } };
}

export default Home;
