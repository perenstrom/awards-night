import { getNominations } from 'services/prisma';
import { NormalizedNominations, Year } from 'types/nominations';
import { prismaContext } from './prisma';

export const refreshNominations = async (
  year: Year
): Promise<NormalizedNominations> => {
  const nominations = await getNominations(year.nominations, prismaContext);

  const normalizedNominations: NormalizedNominations = {};
  nominations.forEach((n) => (normalizedNominations[n.id] = n));

  return normalizedNominations;
};
