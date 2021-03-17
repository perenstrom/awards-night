import Airtable from 'airtable';
import Record from 'airtable/lib/record';
import { Category, Nomination } from 'types/nominations';

const base = new Airtable().base(process.env.AIRTABLE_DATABASE);
const categoriesBase = base('categories');
const nominationsBase = base('nominations');

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
    .select({ filterByFormula: `slug = '${slug}'` })
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

export const getNominations = async (
  nominationIds: string[]
): Promise<Nomination[]> => {
  const query = `OR(${nominationIds
    .map((id) => `RECORD_ID() = '${id}'`)
    .join(',')})
    `;
  const nominationsResult = await nominationsBase
    .select({ filterByFormula: query })
    .firstPage();

  const nominations: Nomination[] = [];
  nominationsResult.forEach((nomination) => {
    nominations.push(formatNomination(nomination));
  });

  return nominations;
};

const formatNomination = (nominationResponse: Record): Nomination => ({
  id: nominationResponse.id,
  year: nominationResponse.get('year'),
  category: nominationResponse.get('category')[0],
  film: nominationResponse.get('film')[0],
  nominee: nominationResponse.get('nominee') ?? null,
  won: !!nominationResponse.get('won')
});
