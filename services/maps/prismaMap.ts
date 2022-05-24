import {
  Category as PrismaCategory,
  Film as PrismaFilm,
  Nomination as PrismaNomination,
  Bet as PrismaBet,
  Player as PrismaPlayer
} from '@prisma/client';
import {
  PlayerWithBets,
  YearWithNominationsAndCategories
} from 'services/prisma/prisma.types';
import {
  Bet,
  Category,
  Film,
  Nomination,
  Player,
  Year
} from 'types/nominations';

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
  },
  bet: {
    fromPrisma: (betResponse: PrismaBet): Bet => ({
      id: betResponse.id,
      player: betResponse.playerId,
      nomination: betResponse.nominationId
    })
  },
  player: {
    fromPrisma: (playerResponse: PrismaPlayer): Player => ({
      id: playerResponse.id,
      auth0UserId: playerResponse.auth0UserId,
      name: playerResponse.name,
      correct: 0,
      bets: [],
      group: playerResponse.groupId
    })
  },
  playerWithBets: {
    fromPrisma: (playerResponse: PlayerWithBets): Player => ({
      id: playerResponse.id,
      auth0UserId: playerResponse.auth0UserId,
      name: playerResponse.name,
      correct: 0,
      bets: playerResponse.bets.map((b) => b.id),
      group: playerResponse.groupId
    })
  }
};
