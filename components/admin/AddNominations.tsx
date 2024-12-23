import { getCategories, getFilms, getYears } from 'services/prisma';
import { AddNominationsForm } from './AddNominationsForm';

export const AddNominations: React.FC<{}> = async () => {
  const categories = await getCategories([]);
  const years = await getYears();
  const films = await getFilms([]);

  return (
    <AddNominationsForm
      availableCategories={categories}
      availableFilms={films}
      availableYears={years}
    />
  );
};
