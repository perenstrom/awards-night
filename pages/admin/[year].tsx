import React, { useState } from 'react';
import Head from 'next/head';
import { GetServerSideProps, NextPage } from 'next';
import {
  Category,
  NominationData,
  NominationId,
  NormalizedNominations
} from 'types/nominations';
import { getNominationData } from 'lib/getNominationData';
import { BetItem } from 'components/BetItem';
import { CategoryBets } from 'components/CategoryBets';
import { updateNomination as updateNominationApi } from 'services/local';
import { ParsedUrlQuery } from 'querystring';
import { withAdminRequired } from 'lib/withAdminRequired';
import { Typography } from '@material-ui/core';
import { MainContainer } from 'components/MainContainer';

type Props = NominationData;

const AdminYearPage: NextPage<Props> = ({
  year,
  categories,
  nominations: initialNominations,
  films
}) => {
  //return null;
  const [nominations, setNominations] =
    useState<NormalizedNominations>(initialNominations);

  const updateNomination = async (
    nominationId: NominationId,
    category: Category
  ) => {
    const winningNominationsInCategory = category.nominations.filter(
      (nominationId) => nominations[nominationId].won
    );

    if (winningNominationsInCategory.length > 1) {
      throw new Error('Multiple wins for one category');
    }

    if (winningNominationsInCategory[0] === nominationId) {
      // Remove win
      const updatedNomination = await updateNominationApi(nominationId, {
        won: false
      });

      setNominations({
        ...nominations,
        [nominationId]: updatedNomination
      });
    } else if (winningNominationsInCategory[0]) {
      // Update both old and new
      const [oldWinner, newWinner] = await Promise.all([
        updateNominationApi(winningNominationsInCategory[0], {
          won: false
        }),
        updateNominationApi(nominationId, {
          won: true
        })
      ]);
      setNominations({
        ...nominations,
        [winningNominationsInCategory[0]]: oldWinner,
        [nominationId]: newWinner
      });
    } else {
      // Update new
      const updatedNomination = await updateNominationApi(nominationId, {
        won: true
      });

      setNominations({
        ...nominations,
        [nominationId]: updatedNomination
      });
    }
  };

  return (
    <div>
      <Head>
        <title>Admin</title>
      </Head>
      <MainContainer>
        <Typography variant="h1">Admin page for {year.year}</Typography>
        {(Object.values(categories) as Category[]).map((category) => (
          <div key={category.id}>
            <Typography variant="h2">{category.name}</Typography>
            <CategoryBets>
              {category.nominations.map((nominationId) => {
                const nomination = nominations
                  ? nominations[nominationId]
                  : initialNominations[nominationId];
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
                    onClick={(nominationId, category) =>
                      updateNomination(nominationId, category)
                    }
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
const getMyServerSideProps: GetServerSideProps<Props, Params> = async (
  context
) => {
  const nominationData = await getNominationData(
    parseInt(context.params.year, 10)
  );

  return {
    props: nominationData
  };
};

export const getServerSideProps = withAdminRequired({
  getServerSideProps: getMyServerSideProps
});

export default AdminYearPage;
