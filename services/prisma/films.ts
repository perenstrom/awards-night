import { Prisma } from '@prisma/client';
import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { prismaMap } from 'services/maps/prismaMap';

import type { Film } from 'types/nominations';
import type { Nullable } from 'types/utilityTypes';
import prisma from 'lib/prisma';

export const createFilm = async (film: Film): Promise<Nullable<Film>> => {
  console.log('Creating film');
  const formattedFilm = prismaMap.film.toPrisma(film);

  const result = await prisma.film.create({
    data: formattedFilm
  });

  if (result) {
    return prismaMap.film.fromPrisma(result);
  } else {
    return null;
  }
};

export const FILMS_CACHE_KEY = 'FILMS_CACHE_KEY';
export const getFilms = unstable_cache(
  cache(async (films: string[]): Promise<Film[]> => {
    console.log('Getting films');
    const args: Prisma.FilmFindManyArgs =
      films.length > 0
        ? {
            where: {
              imdbId: { in: films }
            }
          }
        : {};
    const result = await prisma.film.findMany(args);

    if (result.length === 0) {
      return [];
    } else {
      return result
        .map((film) => prismaMap.film.fromPrisma(film))
        .sort((a, b) => a.name.localeCompare(b.name));
    }
  }),
  [],
  { tags: ['FILMS_CACHE_KEY'] }
);

export const getFilm = cache(async (film: string): Promise<Nullable<Film>> => {
  console.log(`Finding film with id ${film}`);
  const filmResult = await prisma.film.findUnique({
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
