import React from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import {
  GetServerSideProps,
  NextApiRequest,
  NextPage
} from 'next';
import { parseBody } from 'next/dist/next-server/server/api-utils';
import { getCategories, getNominations } from 'services/nominations';
import { Category, Nomination } from 'types/nominations';

interface Props {
  categories: Category[];
  nominations: Nomination[];
}

const Home: NextPage<Props> = ({ categories, nominations }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Admin</title>
      </Head>
      <form method="post">


        <button type="submit">Save</button>
      </form>
      <pre>{JSON.stringify(categories, null, 2)}</pre>ƒ
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (context.req.method === 'POST') {
    const body = await parseBody(context.req as NextApiRequest, '1mb');
  }

  const categories = await getCategories();

  return { props: { categories } };
};

export default Home;
