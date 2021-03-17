import React from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { getCategories, getCategory } from 'services/nominations';
import { Category } from 'types/nominations';
import { ParsedUrlQuery } from 'querystring';

interface Props {
  category: Category;
}

interface Params extends ParsedUrlQuery {
  category: string;
}

const CategoryPage: NextPage<Props> = ({ category }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>{category.name}</title>
      </Head>
      <pre>{JSON.stringify(category, null, 2)}</pre>
    </div>
  );
};

export const getStaticProps: GetStaticProps<Props, Params> = async ({
  params
}) => {
  const category = await getCategory(params.category);

  return { props: { category } };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const categories = await getCategories();

  const paths = categories.map((category) => ({
    params: { category: category.slug }
  }));

  return {
    paths: paths,
    fallback: false
  };
};

export default CategoryPage;
