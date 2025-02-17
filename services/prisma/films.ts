import { Prisma } from '@prisma/client';
import { cache } from 'react';
import { prismaMap } from 'services/maps/prismaMap';

import type { Film } from 'types/nominations';
import type { Nullable } from 'types/utilityTypes';
import { prismaContext } from 'lib/prisma';
import type { Context } from './prisma.types';

export const createFilm = async (
  film: Film,
  ctx: Context
): Promise<Nullable<Film>> => {
  console.log('Creating film');
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

export const getFilms = cache(async (films: string[]): Promise<Film[]> => {
  console.log('Getting films');
  const args: Prisma.FilmFindManyArgs =
    films.length > 0
      ? {
          where: {
            imdbId: { in: films }
          }
        }
      : {};
  const result = await prismaContext.prisma.film.findMany(args);

  if (result.length === 0) {
    return [];
  } else {
    return result
      .map((film) => prismaMap.film.fromPrisma(film))
      .sort((a, b) => a.name.localeCompare(b.name));
  }
});

export const getFilm = cache(async (film: string): Promise<Nullable<Film>> => {
  console.log(`Finding film with id ${film}`);
  const filmResult = await prismaContext.prisma.film.findUnique({
    where: {
      imdbId: film
    }
  });

  if (!filmResult) {
    return null;
  } else {
    return prismaMap.film.fromPrisma(filmResult);
  }
});
