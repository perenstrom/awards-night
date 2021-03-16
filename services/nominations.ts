import Airtable from 'airtable';
import { Category, Nomination } from 'types/nominations';

const base = new Airtable().base(process.env.AIRTABLE_DATABASE);
const categoriesBase = base('categories');

export const getCategories = async () => {
  const categoriesResult = await categoriesBase.select().firstPage();

  const categories = [];
  categoriesResult.forEach((category) => {
    const formattedCategory: Category = {
      id: category.id,
      slug: category.get('slug'),
      name: category.get('name'),
      nominations: category.get('nominations') ?? null,
      bets: category.get('bets') ?? null
    };
    categories.push(formattedCategory);
  });

  return categories;
};

export const getNominations = async (): Promise<any> => {
  try {
    return {};
  } catch (e) {
    console.error(e);
  }
};
