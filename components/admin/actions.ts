'use server';

import { isAdmin } from 'lib/authorization';
import { saveFilm } from 'lib/saveFilm';
import { StatusMessage } from 'types/utilityTypes';

export const createFilm = async (
  previousState: StatusMessage | null | undefined,
  formData: FormData
) => {
  if (!isAdmin()) return;

  const imdb = formData.get('imdbId') as string;
  if (!imdb) return;

  const result = await saveFilm(imdb);

  return result;
};
