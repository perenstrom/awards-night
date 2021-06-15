import { setupServer } from 'msw/node';
import { mockGetCategories } from './handlers/airtable/mockGetCategories';
import { mockGetFilms } from './handlers/airtable/mockGetFilms';
import { mockGetNominations } from './handlers/airtable/mockGetNominations';

export const server = setupServer(
  mockGetCategories().handler,
  mockGetNominations().handler,
  mockGetFilms().handler
);
