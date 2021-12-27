import Record from 'airtable/lib/record';
import { NominationRecord } from 'services/airtable/airtable.types';
import { airtableMap } from 'services/maps/airtableMap';
import { Nomination, NominationBets, NominationId } from 'types/nominations';
import { PartialBy } from 'types/utilityTypes';
import { arrayChunk } from 'utils/arrayChunk';
import { base } from './base';

const nominationsBase = base('nominations');

export const createNominations = async (
  nominations: PartialBy<Nomination, 'id' | 'decided'>[]
): Promise<Nomination[]> => {
  console.log(`Creating nominations:\n${JSON.stringify(nominations, null, 2)}`);
  const nominationsChunks = arrayChunk(nominations, 10);

  return Promise.all<Nomination[]>(
    nominationsChunks.map(
      (nominations) =>
        new Promise<Nomination[]>((resolve, reject) => {
          nominationsBase
            .create(
              nominations.map((nomination) => ({
                fields: airtableMap.nomination.toAirtable(nomination)
              }))
            )
            .then((result) =>
              resolve(
                result.map((nominationResult) =>
                  airtableMap.nomination.fromAirtable(nominationResult)
                )
              )
            )
            .catch((error) => {
              reject(error);
              console.error(error);
            });
        })
    )
  ).then((result) => result.flat());
};

const getNominationsFromAirtable = async (
  nominationIds?: NominationId[]
): Promise<Record[]> => {
  const query = nominationIds
    ? {
        filterByFormula: `OR(${nominationIds
          .map((id) => `RECORD_ID()='${id}'`)
          .join(',')})
          `
      }
    : {};

  let nominations: Record[] = [];
  await nominationsBase
    .select(query)
    .eachPage((nominationsResult, fetchNextPage) => {
      nominations = [...nominations, ...nominationsResult];

      fetchNextPage();
    });

  return nominations;
};

export const getNominations = async (
  nominationIds?: NominationId[]
): Promise<Nomination[]> => {
  const nominationsResult = await getNominationsFromAirtable(nominationIds);

  const nominations: Nomination[] = [];
  nominationsResult.forEach((nomination) => {
    nominations.push(airtableMap.nomination.fromAirtable(nomination));
  });

  return nominations;
};

export const getNominationBets = async (
  nominationIds?: NominationId[]
): Promise<NominationBets> => {
  const nominationsResult = await getNominationsFromAirtable(nominationIds);

  let nominationBets: NominationBets = {};
  nominationsResult.forEach((nomination) => {
    const oneNominationBets = airtableMap.nominationBets.fromAirtable(nomination);
    nominationBets = {...nominationBets, ...oneNominationBets};
  });

  return nominationBets;
};

export const getNominationsByCategoryAndYear = async (
  categorySlug: string,
  year: number
): Promise<Nomination[]> => {
  const query = {
    filterByFormula: `AND(FIND('${year}',ARRAYJOIN(year)),FIND('${categorySlug}',ARRAYJOIN(category)))`
  };

  const nominations: Nomination[] = [];
  await nominationsBase
    .select(query)
    .eachPage((nominationsResult, fetchNextPage) => {
      nominationsResult.forEach((nomination) => {
        nominations.push(airtableMap.nomination.fromAirtable(nomination));
      });

      fetchNextPage();
    });

  return nominations;
};

export const updateNomination = async (
  nominationId: NominationId,
  nomination: Partial<NominationRecord>
): Promise<Nomination> => {
  console.log(
    `Updating nomination:\n${JSON.stringify(
      { nominationId, ...nomination },
      null,
      2
    )}`
  );

  return new Promise((resolve, reject) => {
    nominationsBase
      .update(nominationId, nomination)
      .then((result) => resolve(airtableMap.nomination.fromAirtable(result)))
      .catch((error) => {
        reject(error);
        console.error(error);
      });
  });
};
