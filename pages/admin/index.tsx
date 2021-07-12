import { GetServerSideProps, NextPage } from 'next';
import {
  Typography,
  TextField,
  Box,
  Button,
  makeStyles,
  Paper
} from '@material-ui/core';

import { MainContainer } from 'components/MainContainer';
import { withAdminRequired } from 'lib/withAdminRequired';
import { useRouter } from 'next/router';
import { getFilm as getFilmFromTmdb } from 'services/tmdb';
import { createFilm, getFilmByImdb } from 'services/airtable';
import { Film } from 'types/nominations';
import { PropsWithUser } from 'types/utilityTypes';
import getRawBody from 'raw-body';
import { Alert } from '@material-ui/lab';
import Head from 'next/head';

const useStyles = makeStyles(() => ({
  sectionHeading: {
    paddingTop: 0
  }
}));

type Props = {
  statusMessages?: {
    addFilms: {
      severity: 'error' | 'warning' | 'info' | 'success';
      message: string;
    };
  };
};

const AdminPage: NextPage<PropsWithUser<Props>> = (props) => {
  const { sectionHeading } = useStyles(props);
  const { statusMessages } = props;
  const router = useRouter();

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
                <form action={router.pathname} method="POST">
                  <TextField
                    id="imdb-id"
                    name="imdbId"
                    label="IMDb ID"
                    variant="outlined"
                    size="small"
                    inputProps={{
                      minlength: '9',
                      maxlength: '9',
                      pattern: 'tt[0-9]{7}'
                    }}
                  />
                  <Box ml={1} display="inline">
                    <Button
                      name="action"
                      value="addFilm"
                      variant="contained"
                      color="primary"
                      type="submit"
                      disableElevation
                    >
                      Add
                    </Button>
                  </Box>
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
  if (req.method == 'POST') {
    const qs = require('qs');
    const body = await getRawBody(req);
    const parsedBody = qs.parse(body.toString('utf-8'));

    let film: Film;
    try {
      film = await getFilmByImdb(parsedBody.imdbId);
    } catch (error) {
      // Airtable error
      console.error(error);
      return {
        props: {
          statusMessages: {
            addFilms: {
              severity: 'error',
              message: `Something went wrong, please try again`
            }
          }
        }
      };
    }

    if (!film) {
      // Film is not already in the system
      let filmDetails = null;
      try {
        filmDetails = await getFilmFromTmdb(parsedBody.imdbId);
      } catch (error) {
        // TMDb error
        console.error(error);
        return {
          props: {
            statusMessages: {
              addFilms: {
                severity: 'error',
                message: `Something went wrong, please try again`
              }
            }
          }
        };
      }

      if (!filmDetails) {
        // Couldn't fetch info from TMDb
        return {
          props: {
            statusMessages: {
              addFilms: {
                severity: 'error',
                message: `Couldn't get movie details from TMDb for ${parsedBody.imdbId}`
              }
            }
          }
        };
      }

      let savedFilm = null;
      try {
        savedFilm = await createFilm({
          imdb_id: filmDetails.imdbId,
          name: filmDetails.name,
          poster_url: filmDetails.poster,
          nominations: null
        });
      } catch (error) {
        // Error in airtable call
        console.error(error);
        return {
          props: {
            statusMessages: {
              addFilms: {
                severity: 'error',
                message: `Something went wrong, please try again`
              }
            }
          }
        };
      }

      if (savedFilm) {
        // Film successfully saved
        return {
          props: {
            statusMessages: {
              addFilms: {
                severity: 'success',
                message: `${savedFilm.name} added.`
              }
            }
          }
        };
      }
    } else {
      // Film is already in the system
      return {
        props: {
          statusMessages: {
            addFilms: {
              severity: 'info',
              message: `${film.name} is already added`
            }
          }
        }
      };
    }
  }

  return { props: {} };
};

export const getServerSideProps = withAdminRequired({
  getServerSideProps: getMyServerSideProps
});

export default AdminPage;
