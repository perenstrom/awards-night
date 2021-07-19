import {
  getYear,
  getCategories,
  getNominationsByCategoryAndYear,
  createNominations,
  NominationRecord
} from 'services/airtable';
import { CategoryId, FilmId } from 'types/nominations';
import { StatusMessage } from 'types/utilityTypes';
import { getGenericErrorMessage } from 'utils/statusMessages';

export const saveNominations = async (data: {
  category: CategoryId;
  year: number;
  films: FilmId[];
  nominees: string[];
}): Promise<StatusMessage> => {
  const { category, year, films, nominees } = data;
  const fullYear = await getYear(year);
  const fullCategoryResult = await getCategories([category]);
  const fullCategory = fullCategoryResult[0];
  const existingNominations = await getNominationsByCategoryAndYear(
    fullCategory.slug,
    year
  );

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

  let savedNominations = null;
  try {
    savedNominations = await createNominations(
      films.map<NominationRecord>((filmId, index) => ({
        category: [fullCategory.id],
        film: [filmId],
        nominee: nominees[index],
        won: false,
        year: [fullYear.id]
      }))
    );
  } catch (error) {
    console.log(error);
    return getGenericErrorMessage();
  }

  if (savedNominations) {
    return {
      severity: 'success',
      message: 'Nominations added.'
    };
  } else {
    return getGenericErrorMessage();
  }
};
