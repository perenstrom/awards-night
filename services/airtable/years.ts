import { airtableMap } from 'services/maps/airtableMap';
import { Year, YearId } from 'types/nominations';
import { base } from './base';

const yearsBase = base('years');

export const getYear = async (year: number): Promise<Year> => {
  const years: Year[] = [];
  await yearsBase
    .select({ filterByFormula: `year='${year}'` })
    .eachPage((yearsResult, fetchNextPage) => {
      yearsResult.forEach((year) => {
        years.push(airtableMap.year.fromAirtable(year));
      });

      fetchNextPage();
    });

  if (years.length > 1) {
    throw new Error(`Multiple records with year ${year} found.`);
  } else if (years.length === 0) {
    return null;
  } else {
    return years[0];
  }
};

export const getYears = async (): Promise<Year[]> => {
  const years: Year[] = [];
  await yearsBase.select().eachPage((yearsResult, fetchNextPage) => {
    yearsResult.forEach((year) => {
      years.push(airtableMap.year.fromAirtable(year));
    });

    fetchNextPage();
  });

  return years;
};

export const updateYear = async (
  yearId: YearId,
  year: Partial<Year>
): Promise<Year> => {
  console.log(
    `Updating film:\n${JSON.stringify({ yearId, ...year }, null, 2)}`
  );

  return new Promise((resolve, reject) => {
    yearsBase
      .update(yearId, airtableMap.year.toAirtable(year))
      .then((result) => resolve(airtableMap.year.fromAirtable(result)))
      .catch((error) => {
        reject(error);
        console.error(error);
      });
  });
};
