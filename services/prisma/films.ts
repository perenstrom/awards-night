import { Prisma } from '@prisma/client';
import { prismaMap } from 'services/maps/prismaMap';

import type { Film } from 'types/nominations';
import type { Nullable } from 'types/utilityTypes';
import type { Context } from './prisma.types';

export const createFilm = async (
  film: Film,
  ctx: Context
): Promise<Nullable<Film>> => {
  const formattedFilm = prismaMap.film.toPrisma(film);

  const result = await ctx.prisma.film.create({
    data: formattedFilm
  });

  if (result) {
    return prismaMap.film.fromPrisma(result);
  } else {
    return null;
  }
};

export const getFilms = async (
  films: string[],
  ctx: Context
): Promise<Film[]> => {
  const args: Prisma.FilmFindManyArgs =
    films.length > 0
      ? {
          where: {
            imdbId: { in: films }
          }
        }
      : {};
  const result = await ctx.prisma.film.findMany(args);

  if (result.length === 0) {
    return [];
  } else {
    return result
      .map((film) => prismaMap.film.fromPrisma(film))
      .sort((a, b) => a.name.localeCompare(b.name));
  }
};

export const getFilm = async (
  film: string,
  ctx: Context
): Promise<Nullable<Film>> => {
  const filmResult = await ctx.prisma.film.findUnique({
    where: {
      imdbId: film
    }
  });

  if (!filmResult) {
    return null;
  } else {
    return prismaMap.film.fromPrisma(filmResult);
  }
};
