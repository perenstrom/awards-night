import React, { FormEvent, ReactElement, useRef, useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import getRawBody from 'raw-body';
import {
  CircularProgress,
  Typography,
  TextField,
  Box,
  Button,
  makeStyles,
  Paper
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import { PropsWithUser, StatusMessage } from 'types/utilityTypes';
import { MainContainer } from 'components/MainContainer';
import { withAdminRequired } from 'lib/withAdminRequired';
import { saveFilm } from 'lib/saveFilm';
import { createFilm, createNominations } from 'services/local';
import { Category, CategoryId, Film, FilmId, Year } from 'types/nominations';
import { getCategories, getFilms, getYears } from 'services/airtable';
import { NominationFields } from 'components/admin/NominationFields';
import { saveNominations } from 'lib/saveNominations';
import { parseFormData } from 'utils/parseFormData';
import { AddNominationsFields, PostBody } from 'types/admin.types';

const useStyles = makeStyles(() => ({
  sectionHeading: {
    paddingTop: 0
  }
}));

type Props = {
  statusMessages?: {
    general?: StatusMessage[];
    addFilms?: StatusMessage;
    addNominations?: StatusMessage;
  };
  availableCategories: Category[];
  availableYears: Year[];
  availableFilms: Film[];
  nominationCount: number;
};

const AdminPage: NextPage<PropsWithUser<Props>> = (props) => {
  const { sectionHeading } = useStyles(props);
  const {
    statusMessages: initialStatusMessages,
    availableCategories,
    availableYears,
    availableFilms,
    nominationCount: initialNominationCount
  } = props;
  const router = useRouter();
  const [statusMessages, setStatusMessages] = useState(initialStatusMessages);

  const imdbIdInputElement = useRef<HTMLInputElement>(null);
  const [addFilmStatus, setAddFilmStatus] = useState<'idle' | 'loading'>(
    'idle'
  );
  const onAddFilmSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setAddFilmStatus('loading');
    setStatusMessages({ ...statusMessages, addFilms: null });
    const imdbId = imdbIdInputElement.current.value;

    if (imdbId) {
      const saveFilmResult = await createFilm(imdbId);
      setStatusMessages({ ...statusMessages, addFilms: saveFilmResult });
      if (saveFilmResult.severity !== 'error') {
        imdbIdInputElement.current.value = '';
        imdbIdInputElement.current.focus();
      }
    }
    setAddFilmStatus('idle');
  };

  const nominationCountElement = useRef<HTMLInputElement>(null);
  const [nominationCount, setNominationCount] = useState(
    initialNominationCount
  );
  const onUpdateNominationCount: React.MouseEventHandler<HTMLButtonElement> = (
    event
  ) => {
    event.preventDefault();
    const nominationCount = nominationCountElement.current.value;

    if (nominationCount) {
      setNominationCount(parseInt(nominationCount, 10));
    }
  };

  const [addNominationsStatus, setAddNominationsStatus] = useState<
    'idle' | 'loading'
  >('idle');
  const onAddNominationsSubmit: React.FormEventHandler<HTMLFormElement> =
    async (event) => {
      event.preventDefault();
      const target = event.currentTarget;
      setAddNominationsStatus('loading');
      setStatusMessages({ ...statusMessages, addNominations: null });
      const formData = parseFormData<AddNominationsFields>(
        new FormData(event.currentTarget)
      );
      const saveNominationsResult = await createNominations({
        category: formData.category as CategoryId,
        year: parseInt(formData.year, 10),
        films: formData.films as FilmId[],
        nominees: formData.nominees
      });
      setStatusMessages({
        ...statusMessages,
        addNominations: saveNominationsResult
      });
      if (saveNominationsResult.severity !== 'error') {
        target.reset();
      }
      setAddNominationsStatus('idle');
    };

  const renderNominationFields = (availableFilms: Film[], count: number) => {
    let elements: ReactElement[] = [];
    for (let i = 0; i < count; i++) {
      elements.push(
        <NominationFields
          availableFilms={availableFilms}
          index={i}
          first={i === 0}
          key={`nomination-fields-${i}`}
        />
      );
    }

    return elements;
  };

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
        <Box mt={2}>
          <Paper>
            <Box p={2}>
              <Typography variant="h2" className={sectionHeading}>
                Add film
              </Typography>
              <Box mt={2}>
                <form
                  action={router.pathname}
                  method="POST"
                  onSubmit={onAddFilmSubmit}
                >
                  <TextField
                    id="imdb-id"
                    name="imdbId"
                    label="IMDb ID"
                    variant="outlined"
                    size="small"
                    inputProps={{
                      minLength: '9',
                      maxLength: '9',
                      pattern: 'tt[0-9]{7}'
                    }}
                    inputRef={imdbIdInputElement}
                  />
                  <Box ml={1} display="inline">
                    <Button
                      name="action"
                      value="addFilm"
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={addFilmStatus === 'loading'}
                      disableElevation
                    >
                      Add
                    </Button>
                  </Box>
                  {addFilmStatus === 'loading' && (
                    <Box mt={2.5}>
                      <CircularProgress size={'2rem'} />
                    </Box>
                  )}
                </form>
                {statusMessages?.addFilms && (
                  <Box mt={2}>
                    <Alert severity={statusMessages.addFilms.severity}>
                      {statusMessages.addFilms.message}
                    </Alert>
                  </Box>
                )}
              </Box>
            </Box>
          </Paper>
        </Box>
        {availableCategories && availableYears && availableFilms && (
          <Box mt={2}>
            <Paper>
              <Box p={2}>
                <Typography variant="h2" className={sectionHeading}>
                  Add nominations
                </Typography>
                <Box mt={2}>
                  <form
                    action={router.pathname}
                    method="POST"
                    onSubmit={onAddNominationsSubmit}
                  >
                    <TextField
                      id="year"
                      name="year"
                      label="Year"
                      variant="outlined"
                      size="small"
                      SelectProps={{
                        native: true
                      }}
                      select
                    >
                      {availableYears.map((year) => (
                        <option key={year.id} value={year.year}>
                          {year.year}
                        </option>
                      ))}
                    </TextField>
                    <Box ml={1} display="inline">
                      <TextField
                        id="category"
                        name="category"
                        label="Category"
                        variant="outlined"
                        size="small"
                        SelectProps={{
                          native: true
                        }}
                        select
                      >
                        {availableCategories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </TextField>
                    </Box>
                    <Box ml={2} display="inline">
                      <TextField
                        id="nominationCount"
                        name="nominationCount"
                        label="Nomination count"
                        variant="outlined"
                        size="small"
                        defaultValue={nominationCount}
                        SelectProps={{
                          native: true
                        }}
                        select
                        inputRef={nominationCountElement}
                      >
                        {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((count) => (
                          <option key={`category-count-${count}`} value={count}>
                            {`${count} nominations`}
                          </option>
                        ))}
                      </TextField>
                    </Box>
                    <Box ml={1} display="inline">
                      <Button
                        name="action"
                        value="changeNominationCount"
                        variant="contained"
                        color="primary"
                        type="submit"
                        onClick={onUpdateNominationCount}
                        disabled={addNominationsStatus === 'loading'}
                        disableElevation
                      >
                        Update
                      </Button>
                    </Box>
                    {renderNominationFields(availableFilms, nominationCount)}
                    <Box mt={2}>
                      <Button
                        name="action"
                        value="addNominations"
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={addNominationsStatus === 'loading'}
                        disableElevation
                      >
                        Save
                      </Button>
                    </Box>
                    {addNominationsStatus === 'loading' && (
                      <Box mt={2.5}>
                        <CircularProgress size={'2rem'} />
                      </Box>
                    )}
                  </form>
                  {statusMessages?.addNominations && (
                    <Box mt={2}>
                      <Alert severity={statusMessages.addNominations.severity}>
                        {statusMessages.addNominations.message}
                      </Alert>
                    </Box>
                  )}
                </Box>
              </Box>
            </Paper>
          </Box>
        )}
      </MainContainer>
    </>
  );
};

const getMyServerSideProps: GetServerSideProps<Props> = async ({ req }) => {
  // POST:
  let generalStatusMessages: StatusMessage[] = [];
  let addFilmMessage: StatusMessage = null;
  let addNominationsMessage: StatusMessage = null;
  let nominationCount = 5;

  if (req.method == 'POST') {
    const qs = require('qs');
    const body = await getRawBody(req);
    const parsedBody = qs.parse(body.toString('utf-8')) as PostBody;

    switch (parsedBody.action) {
      case 'addFilm':
        addFilmMessage = await saveFilm(parsedBody.imdbId);
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
        addFilms: addFilmMessage,
        addNominations: addNominationsMessage
      },
      availableCategories,
      availableYears,
      availableFilms,
      nominationCount
    }
  };
};

export const getServerSideProps = withAdminRequired({
  getServerSideProps: getMyServerSideProps
});

export default AdminPage;
