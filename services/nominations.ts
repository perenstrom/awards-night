import { db } from 'lib/db';
import { Nomination } from 'types/nominations';

interface ResponseNomination {
  id: number;
  year: number;
  category_id: number;
  category_name: string;
  won: boolean;
  film: string;
  nominee: string;
}

type NominationsResponse = ResponseNomination[];

export const getNominations = async (): Promise<Nomination[]> => {
  try {
    const nominations: NominationsResponse = await db.any(
      `
      SELECT 
        nominations.id,
        nominations.year,
        nominations.category as "category_id",
        nominations.won,
        nominations.film,
        nominations.nominee,
        categories.name as "category_name"
      FROM nominations
      JOIN categories
      ON nominations.category = categories.id
      `
    );

    return formatNominations(nominations);
  } catch (e) {
    console.error(e);
  }
};

const formatNominations = (nominations: NominationsResponse): Nomination[] => {
  return nominations.map((nomination) => ({
    id: nomination.id,
    year: nomination.year,
    category: {
      id: nomination.category_id,
      name: nomination.category_name
    },
    won: nomination.won,
    film: nomination.film,
    nominee: nomination.nominee
  }));
};
