import { prismaMap } from 'services/maps/prismaMap';

import type { Film } from 'types/nominations';
import type { Context } from './prisma.types';

export const getFilms = async (
  films: string[],
  ctx: Context
): Promise<Film[]> => {
  const result = await ctx.prisma.film.findMany({
    where: {
      imdbId: { in: films }
    }
  });

  if (result.length === 0) {
    return [];
  } else {
    return result.map((film) => prismaMap.film.fromPrisma(film));
  }
};
