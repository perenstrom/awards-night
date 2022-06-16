import { getNominations } from 'services/prisma';
import { Nomination, Year } from 'types/nominations';
import { prismaContext } from './prisma';

export const refreshNominations = async (year: Year): Promise<Nomination[]> => {
  const nominations = await getNominations(year.nominations, prismaContext);

  return nominations;
};
