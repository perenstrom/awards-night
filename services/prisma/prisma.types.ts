import { Prisma, PrismaClient } from '@prisma/client';

const yearWithNominationsAndCategories = Prisma.validator<Prisma.YearArgs>()({
  include: { nominations: true, yearsCategories: true }
});
export type YearWithNominationsAndCategories = Prisma.YearGetPayload<
  typeof yearWithNominationsAndCategories
>;

const playerWithBets = Prisma.validator<Prisma.PlayerArgs>()({
  include: { bets: true }
});
export type PlayerWithBets = Prisma.PlayerGetPayload<typeof playerWithBets>;

export type Context = {
  prisma: PrismaClient;
};
