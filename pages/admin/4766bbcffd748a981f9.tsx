import React, { useState } from 'react';
import Head from 'next/head';
import { GetStaticProps, NextPage } from 'next';
import {
  Category,
  NominationData,
  NominationId,
  NormalizedNominations
} from 'types/nominations';
import { getNominationData } from 'lib/getNominationData';
import { BetItem } from 'components/BetItem';
import { CategoryBets } from 'components/CategoryBets';
import { CategoryHeading } from 'components/CategoryHeading';
import { NominationListWrapper } from 'components/NominationListWrapper';
import { updateNomination as updateNominationApi } from 'services/local';

type Props = NominationData;

const AdminPage: NextPage<Props> = ({
  categories,
  nominations: initialNominations,
  films
}) => {
  return null;
 /*  const [nominations, setNominations] = useState<NormalizedNominations>(
    initialNominations
  );

  const updateNomination = async (nominationId: NominationId, category: Category) => {
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
      <NominationListWrapper>
        <h1>Admin page</h1>
        {categories.map((category) => (
          <div key={category.id}>
            <CategoryHeading>{category.name}</CategoryHeading>
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
      </NominationListWrapper>
    </div>
  ); */
};

export const getStaticProps: GetStaticProps<{}> = async () => {
  //const nominationData = await getNominationData();

  return {
    props: {}
  };
};

export default AdminPage;
