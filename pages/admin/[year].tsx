import { ParsedUrlQuery } from 'querystring';
import React, { useState } from 'react';
import Head from 'next/head';
import { GetServerSideProps, NextPage } from 'next';
import { Typography } from '@mui/material';
import {
  Category,
  Nomination,
  NominationData,
  NormalizedNominations
} from 'types/nominations';
import { getNominationData } from 'lib/getNominationData';
import { BetItem } from 'components/BetItem';
import { CategoryBets } from 'components/CategoryBets';
import { updateNomination as updateNominationApi } from 'services/local';
import { withAdminRequired } from 'lib/authorization';
import { MainContainer } from 'components/MainContainer';
import { prismaContext } from 'lib/prisma';

type Props = NominationData;

const AdminYearPage: NextPage<Props> = ({
  year,
  categories,
  nominations: initialNominations,
  films
}) => {
  const [nominations, setNominations] =
    useState<NormalizedNominations>(initialNominations);

  const updateNomination = async (nominationId: number, category: Category) => {
    const winningNominationsInCategory = category.nominations.filter(
      (n) => nominations[n].won
    );

    if (winningNominationsInCategory.length > 1) {
      throw new Error('Multiple wins for one category');
    }

    const relatedNominations = category.nominations.filter(
      (n) => n !== nominationId && n !== winningNominationsInCategory[0]
    );

    const normalizeNominations = (
      nominations: Nomination[]
    ): NormalizedNominations =>
      nominations.reduce(
        (normalizedRelatedNominations, nomination) => ({
          ...normalizedRelatedNominations,
          [nomination.id]: nomination
        }),
        {}
      );

    if (winningNominationsInCategory[0] === nominationId) {
      // Remove win
      const [updatedNomination, ...updatedRelatedNominations] =
        await Promise.all([
          updateNominationApi(nominationId, {
            won: false,
            decided: false
          }),
          ...relatedNominations.map((nominationId) =>
            updateNominationApi(nominationId, { decided: false })
          )
        ]);

      setNominations({
        ...nominations,
        [nominationId]: updatedNomination,
        ...normalizeNominations(updatedRelatedNominations)
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
      // Set new
      const [updatedNomination, ...updatedRelatedNominations] =
        await Promise.all([
          updateNominationApi(nominationId, {
            won: true,
            decided: true
          }),
          ...relatedNominations.map((nominationId) =>
            updateNominationApi(nominationId, { decided: true })
          )
        ]);

      setNominations({
        ...nominations,
        [nominationId]: updatedNomination,
        ...normalizeNominations(updatedRelatedNominations)
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
          <div key={category.slug}>
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
  if (!context?.params?.year) {
    throw new Error('No year in params');
  }

  const nominationData = await getNominationData(
    parseInt(context?.params?.year, 10),
    prismaContext
  );

  if (!nominationData) {
    throw new Error('Error when fetching nomination data');
  }

  return {
    props: nominationData
  };
};

export const getServerSideProps = withAdminRequired({
  getServerSideProps: getMyServerSideProps
});

export default AdminYearPage;
