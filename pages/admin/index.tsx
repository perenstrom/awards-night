import { FormEvent, useRef, useState } from 'react';
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
import { createFilm } from 'services/local';

const useStyles = makeStyles(() => ({
  sectionHeading: {
    paddingTop: 0
  }
}));

type Props = {
  statusMessages?: {
    addFilms: StatusMessage;
  };
};

const AdminPage: NextPage<PropsWithUser<Props>> = (props) => {
  const { sectionHeading } = useStyles(props);
  const { statusMessages: initialStatusMessages } = props;
  const router = useRouter();
  const imdbIdInputElement = useRef<HTMLInputElement>(null);

  const [addFilmStatus, setAddFilmStatus] = useState<'idle' | 'loading'>(
    'idle'
  );
  const [statusMessages, setStatusMessages] = useState(initialStatusMessages);
  const onSubmit = async (event: FormEvent) => {
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

  return (
    <>
      <Head>
        <title>Admin dashboard</title>
      </Head>
      <MainContainer>
        <Typography variant="h1">Admin panel</Typography>
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
                  onSubmit={onSubmit}
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
      </MainContainer>
    </>
  );
};

const getMyServerSideProps: GetServerSideProps<Props> = async ({ req }) => {
  // POST:
  if (req.method == 'POST') {
    const qs = require('qs');
    const body = await getRawBody(req);
    const parsedBody = qs.parse(body.toString('utf-8'));

    const saveFilmResult = await saveFilm(parsedBody.imdbId);
    return {
      props: {
        statusMessages: {
          addFilms: saveFilmResult
        }
      }
    };
  }

  // GET:
  return { props: {} };
};

export const getServerSideProps = withAdminRequired({
  getServerSideProps: getMyServerSideProps
});

export default AdminPage;
