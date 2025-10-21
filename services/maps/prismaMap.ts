import {
  Category as PrismaCategory,
  Film as PrismaFilm,
  Nomination as PrismaNomination,
  Bet as PrismaBet,
  Player as PrismaPlayer,
  Year as PrismaYear,
  Group as PrismaGroup,
  Prisma
} from '@prisma/client';
import {
  CategoryWithNominations,
  PlayerWithBets,
  PlayerWithGroups,
  YearWithNominationsAndCategories
} from 'services/prisma/prisma.types';
import {
  BaseYear,
  Bet,
  Category,
  Film,
  Group,
  Nomination,
  Player,
  Year
} from 'types/nominations';
import { PartialBy } from 'types/utilityTypes';

export const prismaMap = {
  baseYear: {
    fromPrisma: (yearResponse: PrismaYear): BaseYear => ({
      year: yearResponse.year,
      name: yearResponse.name,
      date: yearResponse.date.toISOString(),
      bettingOpen: yearResponse.bettingOpen,
      awardsFinished: yearResponse.awardsFinished
    })
  },
  year: {
    fromPrisma: (yearResponse: YearWithNominationsAndCategories): Year => ({
      year: yearResponse.year,
      name: yearResponse.name,
      date: yearResponse.date.toISOString(),
      bettingOpen: yearResponse.bettingOpen,
      awardsFinished: yearResponse.awardsFinished,
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
      nextCategory: null,
      decided: false
    }),
    withNominations: {
      fromPrisma: (
        categoryResponse: CategoryWithNominations
      ): { category: Category; nominations: Nomination[] } => ({
        category: prismaMap.category.fromPrisma(categoryResponse),
        nominations: categoryResponse.nominations.map((n) =>
          prismaMap.nomination.fromPrisma(n)
        )
      })
    }
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
    }),
    toPrisma: (
      nomination: PartialBy<Nomination, 'id'>
    ): Prisma.NominationCreateManyInput => ({
      yearId: nomination.year,
      categoryId: nomination.category,
      nominee: nomination.nominee,
      won: nomination.won,
      decided: nomination.decided,
      filmId: nomination.film
    })
  },
  film: {
    fromPrisma: (filmResponse: PrismaFilm): Film => ({
      imdbId: filmResponse.imdbId,
      name: filmResponse.name,
      poster: filmResponse.posterUrl || '',
      releaseDate: filmResponse.releaseDate?.toDateString() || ''
    }),
    toPrisma: (film: Film): Prisma.FilmCreateInput => ({
      imdbId: film.imdbId,
      name: film.name,
      posterUrl: film.poster,
      releaseDate: film.releaseDate && new Date(film.releaseDate)
    })
  },
  bet: {
    fromPrisma: (betResponse: PrismaBet): Bet => ({
      id: betResponse.id,
      player: betResponse.playerId,
      nomination: betResponse.nominationId
    }),
    toPrisma: (bet: PartialBy<Bet, 'id'>): Prisma.BetCreateInput => ({
      nomination: {
        connect: {
          id: bet.nomination
        }
      },
      player: {
        connect: {
          id: bet.player
        }
      }
    })
  },
  player: {
    fromPrisma: (playerResponse: PrismaPlayer): Player => ({
      id: playerResponse.id,
      auth0UserId: playerResponse.auth0UserId,
      name: playerResponse.name,
      correct: 0,
      bets: [],
      groups: [],
      style: 0
    })
  },
  playerWithBets: {
    fromPrisma: (playerResponse: PlayerWithBets): Player => ({
      id: playerResponse.id,
      auth0UserId: playerResponse.auth0UserId,
      name: playerResponse.name,
      correct: 0,
      bets: playerResponse.bets ? playerResponse.bets.map((b) => b.id) : [],
      groups: playerResponse.groups
        ? playerResponse.groups.map((g) => g.groupId)
        : [],
      style: 0
    })
  },
  playerWithGroups: {
    fromPrisma: (playerResponse: PlayerWithGroups): Player => ({
      id: playerResponse.id,
      auth0UserId: playerResponse.auth0UserId,
      name: playerResponse.name,
      correct: 0,
      bets: [],
      groups: playerResponse.groups
        ? playerResponse.groups.map((g) => g.groupId)
        : [],
      style: 0
    })
  },
  group: {
    fromPrisma: (groupResponse: PrismaGroup): Group => ({
      id: groupResponse.id,
      name: groupResponse.name,
      slug: groupResponse.slug
    })
  }
};
