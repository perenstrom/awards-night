import { NormalizedCategories } from 'types/nominations';

export const getNormalizedCategoriesFixture = (
  year: number
): NormalizedCategories => {
  const categoriesFixture = {
    2020: {
      'best-adapted-screenplay': {
        id: 'best-adapted-screenplay-id',
        name: 'Best Adapted Screenplay',
        nominations: [
          'nomination-2020-best-adapted-screenplay-1',
          'nomination-2020-best-adapted-screenplay-2'
        ],
        previousCategory: null,
        nextCategory: 'best-picture',
        slug: 'best-adapted-screenplay'
      },
      'best-picture': {
        id: 'best-picture-id',
        name: 'Best Picture',
        nominations: [
          'nomination-2020-best-picture-1',
          'nomination-2020-best-picture-2'
        ],
        previousCategory: 'best-adapted-screenplay',
        nextCategory: null,
        slug: 'best-picture'
      }
    },
    2021: {
      'best-animated-short': {
        id: 'best-animated-short-id',
        name: 'Best Animated Short',
        nominations: [
          'nomination-2021-best-animated-short-1',
          'nomination-2021-best-animated-short-2'
        ],
        previousCategory: null,
        nextCategory: 'best-picture',
        slug: 'best-animated-short'
      },
      'best-picture': {
        id: 'best-picture-id',
        name: 'Best Picture',
        nominations: [
          'nomination-2021-best-picture-1',
          'nomination-2021-best-picture-2'
        ],
        previousCategory: 'best-animated-short',
        nextCategory: null,
        slug: 'best-picture'
      }
    }
  };

  return categoriesFixture[year];
};
