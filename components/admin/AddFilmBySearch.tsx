import React, { FormEvent, useRef, useState } from 'react';
import {
  CircularProgress,
  Typography,
  TextField,
  Box,
  Button,
  makeStyles,
  Paper,
  List,
  ListItem,
  ListItemText
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { StatusMessage } from 'types/utilityTypes';
import { TmdbFilmResult } from 'types/nominations';
import { searchFilms } from 'services/local';

const useStyles = makeStyles(() => ({
  sectionHeading: {
    paddingTop: 0
  }
}));

interface Props {
  submitAction: string;
  searchResults: TmdbFilmResult[];
  parentStatusMessage?: StatusMessage;
}

export const AddFilmBySearch: React.FC<Props> = (props) => {
  const { sectionHeading } = useStyles(props);
  const {
    submitAction,
    searchResults: initialSearchResults,
    parentStatusMessage
  } = props;

  const [statusMessage, setStatusMessage] = useState(parentStatusMessage);
  const [searchResults, setSearchResults] = useState(initialSearchResults);

  const searchFilmInputElement = useRef<HTMLInputElement>(null);
  const [searchFilmStatus, setSearchFilmStatus] = useState<'idle' | 'loading'>(
    'idle'
  );
  const onSearchFilmSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSearchFilmStatus('loading');
    setStatusMessage(null);
    const query = searchFilmInputElement.current.value;

    if (query) {
      try {
        const searchFilmResult = await searchFilms(query);
        setSearchResults(searchFilmResult);
      } catch (_) {
        setStatusMessage({
          severity: 'error',
          message:
            'Something went wrong when searching for films, please try again.'
        });
      }
    }
    setSearchFilmStatus('idle');
  };

  return (
    <Box mt={2}>
      <Paper>
        <Box p={2}>
          <Typography variant="h2" className={sectionHeading}>
            Search films
          </Typography>
          <Box mt={2}>
            <form
              action={submitAction}
              method="POST"
              onSubmit={onSearchFilmSubmit}
            >
              <TextField
                id="filmQuery"
                name="filmQuery"
                label="Film name"
                variant="outlined"
                size="small"
                inputRef={searchFilmInputElement}
              />
              <Box ml={1} display="inline">
                <Button
                  name="action"
                  value="searchFilms"
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={searchFilmStatus === 'loading'}
                  disableElevation
                >
                  Search
                </Button>
              </Box>
              {searchFilmStatus === 'loading' && (
                <Box mt={2.5}>
                  <CircularProgress size={'2rem'} />
                </Box>
              )}
            </form>
            {searchResults.length > 0 && (
              <form action={submitAction} method="POST">
                <input type="hidden" name="action" value="addFilmByTmdbId" />
                <List dense>
                  {searchResults.map((film) => (
                    <ListItem
                      button
                      type="submit"
                      name="tmdbId"
                      value={film.tmdbId}
                      component="button"
                      key={film.tmdbId}
                    >
                      <ListItemText>
                        {`${film.name} (${film.releaseDate.substr(0, 4)})`}
                      </ListItemText>
                    </ListItem>
                  ))}
                </List>
              </form>
            )}
            {statusMessage && (
              <Box mt={2}>
                <Alert severity={statusMessage.severity}>
                  {statusMessage.message}
                </Alert>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
