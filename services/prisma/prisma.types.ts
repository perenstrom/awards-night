import { Prisma, PrismaClient } from '@prisma/generated';

export type YearWithNominationsAndCategories = Prisma.YearGetPayload<{
  include: { nominations: true; yearsCategories: true };
}>;

export type PlayerWithBets = Prisma.PlayerGetPayload<{
  include: { bets: true; groups: true };
}>;

export type PlayerWithGroups = Prisma.PlayerGetPayload<{
  include: { groups: true };
}>;

export type CategoryWithNominations = Prisma.CategoryGetPayload<{
  include: { nominations: true };
}>;

export type CategoryWithYears = Prisma.CategoryGetPayload<{
  include: { yearsCategories: true };
}>;

export type Context = {
  prisma: PrismaClient;
};
