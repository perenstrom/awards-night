import { Category } from '@prisma/client';

export const getCategoriesResponseFixture = (year: number): Category[] => {
  const categories: Record<number, Category[]> = {
    2020: [
      {
        slug: 'best-hair-and-makeup',
        name: 'Best Hair and Makeup'
      },
      {
        slug: 'best-supporting-actor',
        name: 'Best Supporting Actor'
      }
    ],
    2021: [
      {
        slug: 'best-picture',
        name: 'Best Picture'
      },
      {
        slug: 'best-supporting-actress',
        name: 'Best Supporting Actress'
      }
    ]
  };
  return categories[year];
};
