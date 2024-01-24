import { prismaContext } from 'lib/prisma';
import { getCategories, getFilms, getYears } from 'services/prisma';
import { AddNominationsForm } from './AddNominationsForm';

export const AddNominations: React.FC<{}> = async () => {
  const categories = await getCategories([], prismaContext);
  const years = await getYears(prismaContext);
  const films = await getFilms([]);

  return (
    <AddNominationsForm
      availableCategories={categories}
      availableFilms={films}
      availableYears={years}
    />
  );
};
