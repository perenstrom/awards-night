import React from 'react';
import Head from 'next/head';
import { GetStaticProps, NextPage } from 'next';
import { Category, NominationData } from 'types/nominations';
import { getNominationData } from 'lib/getNominationData';
import { BetItem } from 'components/BetItem';
import { CategoryBets } from 'components/CategoryBets';
import { CategoryHeading } from 'components/CategoryHeading';
import { NominationListWrapper } from 'components/NominationListWrapper';

type Props = NominationData;

const updateNomination = (nominationId: string, category: Category) => {
  console.log(nominationId, category);
}

const AdminPage: NextPage<Props> = ({ categories, nominations, films }) => {
  return (
    <div>
      <Head>
        <title>Admin</title>
      </Head>
      <NominationListWrapper>
        <h1>Admin page</h1>
        {categories.map((category) => (
          <div key={category.id}>
            <CategoryHeading>{category.name}</CategoryHeading>
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
                    onClick={updateNomination}
                  />
                );
              })}
            </CategoryBets>
          </div>
        ))}
      </NominationListWrapper>
    </div>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const bettingData = await getNominationData();

  return {
    props: bettingData
  };
};

export default AdminPage;
