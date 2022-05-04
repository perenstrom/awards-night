import { Prisma, PrismaClient } from '@prisma/client';

const yearWithNominationsAndCategories = Prisma.validator<Prisma.YearArgs>()({
  include: { nominations: true, yearsCategories: true }
});

export type YearWithNominationsAndCategories = Prisma.YearGetPayload<
  typeof yearWithNominationsAndCategories
>;

export type Context = {
  prisma: PrismaClient
}