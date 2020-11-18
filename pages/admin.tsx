import React from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import {
  GetServerSideProps,
  GetStaticProps,
  NextApiRequest,
  NextPage
} from 'next';
import { parseBody } from 'next/dist/next-server/server/api-utils';
import { addNomination, getCategories, getNominations } from 'services/nominations';
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
        <label htmlFor="year">Year</label>
        <input type="text" name="year" id="year" />

        <select name="category">
          {categories.map((category) => (
            <option value={category.id}>{category.name}</option>
          ))}
        </select>

        <label htmlFor="film">Film</label>
        <input type="text" name="film" id="film" />

        <label htmlFor="nominee">Nominee</label>
        <input type="text" name="nominee" id="nominee" />

        <button type="submit">Save</button>
      </form>
      <pre>{JSON.stringify(categories, null, 2)}</pre>
      <pre>{JSON.stringify(nominations, null, 2)}</pre>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (context.req.method === 'POST') {
    const body = await parseBody(context.req as NextApiRequest, '1mb');
    await addNomination(body);
  }

  const categories = await getCategories();
  const nominations = await getNominations();

  return { props: { categories, nominations } };
};

export default Home;
