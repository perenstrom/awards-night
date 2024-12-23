import { Prisma, PrismaClient } from '@prisma/client';

const yearWithNominationsAndCategories =
  Prisma.validator<Prisma.YearDefaultArgs>()({
    include: { nominations: true, yearsCategories: true }
  });
export type YearWithNominationsAndCategories = Prisma.YearGetPayload<
  typeof yearWithNominationsAndCategories
>;

const playerWithBets = Prisma.validator<Prisma.PlayerDefaultArgs>()({
  include: { bets: true }
});
export type PlayerWithBets = Prisma.PlayerGetPayload<typeof playerWithBets>;

const categoryWithNominations = Prisma.validator<Prisma.CategoryDefaultArgs>()({
  include: { nominations: true }
});
export type CategoryWithNominations = Prisma.CategoryGetPayload<
  typeof categoryWithNominations
>;

export type Context = {
  prisma: PrismaClient;
};
