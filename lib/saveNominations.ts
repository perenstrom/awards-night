import { getYear, updateYear } from 'services/airtable';
import {
  getCategories,
  getNominationsByCategoryAndYear,
  createNominations
} from 'services/airtable';
import {
  Category,
  CategoryId,
  FilmId,
  Nomination,
  Year
} from 'types/nominations';
import { Nullable, PartialBy, StatusMessage } from 'types/utilityTypes';
import { getGenericErrorMessage } from 'utils/statusMessages';
import { triggerDeploy } from 'utils/triggerDeploy';

export const saveNominations = async (data: {
  category: CategoryId;
  year: number;
  films: FilmId[];
  nominees: string[];
}): Promise<StatusMessage> => {
  const { category, year, films, nominees } = data;

  let fullYear: Nullable<Year>;
  let fullCategoryResult: Nullable<Category[]>;
  let fullCategory: Nullable<Category>;
  let existingNominations: Nullable<Nomination[]>;
  try {
    fullYear = await getYear(year);
    fullCategoryResult = await getCategories([category]);
    fullCategory = fullCategoryResult[0];
    existingNominations = await getNominationsByCategoryAndYear(
      fullCategory.slug,
      year
    );
  } catch (error) {
    return getGenericErrorMessage();
  }

  if (!fullYear || !fullCategoryResult || !fullCategory) {
    return getGenericErrorMessage();
  }

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

  const categorySavedOnYear = fullYear.categories.includes(fullCategory.id);
  if (!categorySavedOnYear) {
    await updateYear(fullYear.id, {
      categories: fullYear.categories.concat([fullCategory.id])
    }).catch(() => {
      getGenericErrorMessage();
    });
  }

  let savedNominations = null;
  try {
    savedNominations = await createNominations(
      films.map<PartialBy<Nomination, 'id' | 'decided'>>((filmId, index) => ({
        category: (fullCategory as Category).id,
        film: filmId,
        nominee: nominees[index],
        won: false,
        year: (fullYear as Year).id
      }))
    );
  } catch (error) {
    console.log(error);
    return getGenericErrorMessage();
  }

  if (savedNominations) {
    await triggerDeploy();
    return {
      severity: 'success',
      message: 'Nominations added.'
    };
  } else {
    return getGenericErrorMessage();
  }
};
