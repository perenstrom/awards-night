import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import getRawBody from 'raw-body';
import { Typography, Box } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import { PropsWithUser, StatusMessage } from 'types/utilityTypes';
import { MainContainer } from 'components/MainContainer';
import { withAdminRequired } from 'lib/withAdminRequired';
import { saveFilm } from 'lib/saveFilm';
import { Category, CategoryId, TmdbFilmResult, Film, FilmId, Year } from 'types/nominations';
import { getCategories, getFilms, getYears } from 'services/airtable';
import { saveNominations } from 'lib/saveNominations';
import { PostBody } from 'types/admin.types';
import { AddFilm } from 'components/admin/AddFilm';
import { AddNominations } from 'components/admin/AddNominations';
import { AddFilmBySearch } from 'components/admin/AddFilmBySearch';
import { searchFilms } from 'services/tmdb';

type Props = {
  statusMessages?: {
    general?: StatusMessage[];
    addFilms?: StatusMessage;
    searchFilms?: StatusMessage;
    addNominations?: StatusMessage;
  };
  availableCategories: Category[];
  availableYears: Year[];
  availableFilms: Film[];
  nominationCount: number;
  searchResults?: TmdbFilmResult[];
};

const AdminPage: NextPage<PropsWithUser<Props>> = (props) => {
  const {
    statusMessages,
    availableCategories,
    availableYears,
    availableFilms,
    nominationCount: initialNominationCount,
    searchResults
  } = props;
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Admin dashboard</title>
      </Head>
      <MainContainer>
        <Typography variant="h1">Admin panel</Typography>
        {statusMessages?.general &&
          statusMessages?.general.map((message, index) => (
            <Box mt={2} key={`general-status-message-${index}`}>
              <Alert severity={message.severity}>{message.message}</Alert>
            </Box>
          ))}
        <AddFilm
          submitAction={router.pathname}
          parentStatusMessage={statusMessages.addFilms}
        />
        <AddFilmBySearch
          submitAction={router.pathname}
          searchResults={searchResults}
          parentStatusMessage={statusMessages.searchFilms}
        />
        {availableCategories && availableYears && availableFilms && (
          <AddNominations
            submitAction={router.pathname}
            parentStatusMessage={statusMessages.addNominations}
            initialNominationCount={initialNominationCount}
            availableCategories={availableCategories}
            availableFilms={availableFilms}
            availableYears={availableYears}
          />
        )}
      </MainContainer>
    </>
  );
};

const getMyServerSideProps: GetServerSideProps<Props> = async ({ req }) => {
  // POST:
  let generalStatusMessages: StatusMessage[] = [];
  let addFilmMessage: StatusMessage = null;
  let searchFilmsMessage: StatusMessage = null;
  let searchResults: TmdbFilmResult[] = [];
  let addNominationsMessage: StatusMessage = null;
  let nominationCount = 5;

  if (req.method == 'POST') {
    const qs = require('qs');
    const body = await getRawBody(req);
    const parsedBody = qs.parse(body.toString('utf-8')) as PostBody;

    switch (parsedBody.action) {
      case 'addFilmByImdbId':
        addFilmMessage = await saveFilm(parsedBody.imdbId);
        break;

      case 'searchFilms':
        searchResults = await searchFilms(parsedBody.filmQuery);
        break;

      case 'addNominations':
        const { category, year, films, nominees } = parsedBody;
        addNominationsMessage = await saveNominations({
          category: category as CategoryId,
          year: parseInt(year, 10),
          films: films as FilmId[],
          nominees
        });
        break;

      case 'changeNominationCount':
        nominationCount = parseInt(parsedBody.nominationCount, 10);
        break;

      default:
        generalStatusMessages.push({
          severity: 'warning',
          message: 'Invalid action.'
        });
        break;
    }
  }

  // All:
  const availableCategories = await getCategories().catch<Category[]>(() => {
    generalStatusMessages.push({
      severity: 'error',
      message: 'Failed to fetch categories.'
    });
    return null;
  });
  const availableYears = await getYears().catch<Year[]>(() => {
    generalStatusMessages.push({
      severity: 'error',
      message: 'Failed to fetch years.'
    });
    return null;
  });
  const availableFilms = await getFilms().catch<Film[]>(() => {
    generalStatusMessages.push({
      severity: 'error',
      message: 'Failed to fetch films.'
    });
    return null;
  });

  return {
    props: {
      statusMessages: {
        general: generalStatusMessages,
        searchFilms: searchFilmsMessage,
        addFilms: addFilmMessage,
        addNominations: addNominationsMessage
      },
      availableCategories,
      availableYears,
      availableFilms,
      nominationCount,
      searchResults
    }
  };
};

export const getServerSideProps = withAdminRequired({
  getServerSideProps: getMyServerSideProps
});

export default AdminPage;
