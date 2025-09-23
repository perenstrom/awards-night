import { Prisma, PrismaClient } from '@prisma/client';

export type YearWithNominationsAndCategories = Prisma.YearGetPayload<{
  include: { nominations: true; yearsCategories: true };
}>;

export type PlayerWithBets = Prisma.PlayerGetPayload<{
  include: { bets: true };
}>;

export type CategoryWithNominations = Prisma.CategoryGetPayload<{
  include: { nominations: true };
}>;

export type Context = {
  prisma: PrismaClient;
};
