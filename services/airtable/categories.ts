import { airtableMap } from "services/maps/airtableMap";
import { CategoryId, Category } from "types/nominations";
import { base } from "./base";

const categoriesBase = base('categories');

export const getCategories = async (
  categoryIds?: CategoryId[]
): Promise<Category[]> => {
  const query = categoryIds
    ? {
        filterByFormula: `OR(${categoryIds
          .map((id) => `RECORD_ID()='${id}'`)
          .join(',')})
    `
      }
    : {};

  const categories: Category[] = [];
  try {
    await categoriesBase
      .select({ ...query, sort: [{ field: 'name', direction: 'asc' }] })
      .eachPage((categoriesResult, fetchNextPage) => {
        categoriesResult.forEach((category) => {
          categories.push(airtableMap.category.fromAirtable(category));
        });

        fetchNextPage();
      });

    return addAdjacentCategories(categories);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const addAdjacentCategories = (categories: Category[]): Category[] => {
  return categories.map((category, index, categories) => {
    const previousCategory = index === 0 ? null : categories[index - 1].slug;
    const nextCategory =
      index === categories.length - 1 ? null : categories[index + 1].slug;
    return { ...category, previousCategory, nextCategory };
  });
};