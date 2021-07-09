import { setupServer } from 'msw/node';
import { mockGetBets } from './handlers/airtable/mockGetBets';
import { mockGetCategories } from './handlers/airtable/mockGetCategories';
import { mockGetFilms } from './handlers/airtable/mockGetFilms';
import { mockGetNominations } from './handlers/airtable/mockGetNominations';
import { mockGetPlayers } from './handlers/airtable/mockGetPlayers';
import { mockGetYears } from './handlers/airtable/mockGetYears';

export const server = setupServer(
  mockGetYears().handler,
  mockGetCategories().handler,
  mockGetNominations().handler,
  mockGetBets().handler,
  mockGetPlayers().handler,
  mockGetFilms().handler
);
