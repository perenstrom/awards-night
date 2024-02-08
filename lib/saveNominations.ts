import { getYear } from 'services/prisma';
import { getCategoriesWithNominationsForYear } from 'services/prisma/categories';
import { createNominations } from 'services/prisma/nominations';
import { connectCategoryToYear } from 'services/prisma/years';
import { getGenericErrorMessage } from 'utils/statusMessages';
//import { triggerDeploy } from 'utils/triggerDeploy';

import type { Nomination } from 'types/nominations';
import type { PartialBy, StatusMessage } from 'types/utilityTypes';
import { prismaContext } from './prisma';

const getData = async (data: { category: string; year: number }) => {
  const { category, year } = data;

  try {
    const fullYear = await getYear(year);
    if (!fullYear) {
      throw new Error('Null year');
    }

    const fullCategoryResult = await getCategoriesWithNominationsForYear(
      [category],
      year,
      prismaContext
    );
    const fullCategory = fullCategoryResult[0].category;
    const existingNominations = fullCategoryResult[0].nominations;

    return {
      success: true as const,
      data: {
        fullYear,
        fullCategory,
        existingNominations
      }
    };
  } catch (error) {
    return {
      success: false as const,
      data: null
    };
  }
};

export const saveNominations = async (data: {
  category: string;
  year: number;
  films: string[];
  nominees: string[];
}): Promise<StatusMessage> => {
  const { category, year, films, nominees } = data;

  const result = await getData({
    category,
    year
  });

  if (!result.success) {
    return getGenericErrorMessage();
  }

  const { fullYear, fullCategory, existingNominations } = result.data;

  if (existingNominations.length > 0) {
    return {
      severity: 'error',
      message: `Nominations for ${fullCategory.name} ${year} already exist.`
    };
  }

  const fullNominations = films.map(
    (film, index) => `${film}-${nominees[index]}`
  );
  const noDuplicates = fullNominations.every(
    (nomination, index, nominations) =>
      nominations.indexOf(nomination) === index
  );
  if (!noDuplicates) {
    return {
      severity: 'error',
      message: `The same film and nominee cannot be nominated twice.`
    };
  }

  const categorySavedOnYear = fullYear.categories.includes(fullCategory.slug);
  if (!categorySavedOnYear) {
    await connectCategoryToYear(fullCategory.slug, year, prismaContext).catch(
      () => {
        getGenericErrorMessage();
      }
    );
  }

  let saveNominationsResult = false;
  try {
    const nominationsToSave = films.map<PartialBy<Nomination, 'id'>>(
      (filmId, index) => ({
        category: fullCategory.slug,
        film: filmId,
        nominee: nominees[index],
        won: false,
        year: year,
        decided: false
      })
    );

    saveNominationsResult = await createNominations(
      nominationsToSave,
      prismaContext
    );
  } catch (error) {
    console.log(error);
    return getGenericErrorMessage();
  }

  if (saveNominationsResult) {
    // await triggerDeploy();
    return {
      severity: 'success',
      message: 'Nominations added.'
    };
  } else {
    console.log('Nominations not saved');
    return getGenericErrorMessage();
  }
};
