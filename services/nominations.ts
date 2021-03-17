import Airtable from 'airtable';
import Record from 'airtable/lib/record';
import { Category, Nomination } from 'types/nominations';

const base = new Airtable().base(process.env.AIRTABLE_DATABASE);
const categoriesBase = base('categories');

export const getCategories = async (): Promise<Category[]> => {
  const categoriesResult = await categoriesBase.select().firstPage();

  const categories: Category[] = [];
  categoriesResult.forEach((category) => {
    categories.push(formatCategory(category));
  });

  return categories;
};

export const getCategory = async (slug: string): Promise<Category> => {
  const categoryResult = await categoriesBase
    .select({ filterByFormula: `{slug} = '${slug}'` })
    .firstPage();

  return formatCategory(categoryResult[0]);
};

const formatCategory = (categoryResponse: Record): Category => ({
  id: categoryResponse.id,
  slug: categoryResponse.get('slug'),
  name: categoryResponse.get('name'),
  nominations: categoryResponse.get('nominations') ?? null,
  bets: categoryResponse.get('bets') ?? null
});

export const getNominations = async (): Promise<any> => {
  try {
    return {};
  } catch (e) {
    console.error(e);
  }
};
