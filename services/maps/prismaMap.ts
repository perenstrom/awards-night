import {
  Category as PrismaCategory,
  Film as PrismaFilm,
  Nomination as PrismaNomination
} from '@prisma/client';
import { YearWithNominationsAndCategories } from 'services/prisma/prisma.types';
import { Category, Film, Nomination, Year } from 'types/nominations';

export const prismaMap = {
  year: {
    fromPrisma: (yearResponse: YearWithNominationsAndCategories): Year => ({
      year: yearResponse.year,
      name: yearResponse.name,
      date: yearResponse.date.toISOString(),
      bettingOpen: yearResponse.bettingOpen,
      categories: yearResponse.yearsCategories.map(
        (yearCat) => yearCat.categoryId
      ),
      nominations: yearResponse.nominations.map((nom) => nom.id)
    })
  },
  category: {
    fromPrisma: (categoryResponse: PrismaCategory): Category => ({
      slug: categoryResponse.slug,
      name: categoryResponse.name,
      nominations: [],
      previousCategory: null,
      nextCategory: null
    })
  },
  nomination: {
    fromPrisma: (nominationResponse: PrismaNomination): Nomination => ({
      id: nominationResponse.id,
      year: nominationResponse.yearId,
      category: nominationResponse.categoryId,
      won: nominationResponse.won,
      film: nominationResponse.filmId,
      nominee: nominationResponse.nominee || '',
      decided: nominationResponse.decided
    })
  },
  film: {
    fromPrisma: (filmResponse: PrismaFilm): Film => ({
      imdbId: filmResponse.imdbId,
      name: filmResponse.name,
      poster: filmResponse.posterUrl || '',
      releaseDate: filmResponse.releaseDate?.toDateString() || ''
    })
  }
};
