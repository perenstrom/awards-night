import React, { FormEvent, useRef, useState } from 'react';
import {
  CircularProgress,
  Typography,
  TextField,
  Box,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Alert
} from '@mui/material';
import { Nullable, StatusMessage } from 'types/utilityTypes';
import { TmdbFilmResult } from 'types/nominations';
import { createFilmByTmdb, searchFilms } from 'services/local';

interface Props {
  submitAction: string;
  searchResults: TmdbFilmResult[];
  parentStatusMessage?: StatusMessage;
}

export const AddFilmBySearch: React.FC<Props> = (props) => {
  const {
    submitAction,
    searchResults: initialSearchResults,
    parentStatusMessage
  } = props;

  const [statusMessage, setStatusMessage] =
    useState<Nullable<StatusMessage>>(parentStatusMessage);
  const [searchResults, setSearchResults] = useState(initialSearchResults);

  const searchFilmInputElement = useRef<HTMLInputElement>(null);
  const [searchFilmStatus, setSearchFilmStatus] = useState<'idle' | 'loading'>(
    'idle'
  );
  const onSearchFilmSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSearchFilmStatus('loading');
    setStatusMessage(null);
    setSearchResults([]);
    const query = searchFilmInputElement.current?.value;

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

  const [addFilmStatus, setAddFilmStatus] = useState<'idle' | 'loading'>(
    'idle'
  );
  const onAddFilmClick = async (tmdbId: string) => {
    setAddFilmStatus('loading');
    setStatusMessage(null);
    try {
      const saveFilmResult = await createFilmByTmdb(tmdbId);
      setSearchResults([]);
      setStatusMessage(saveFilmResult);
    } catch (error) {
      setStatusMessage({
        severity: 'error',
        message: 'Something went wrong when adding movie. Please try again.'
      });
    }
    setAddFilmStatus('idle');
  };

  return (
    <Box mt={2}>
      <Paper>
        <Box p={2}>
          <Typography variant="h2" sx={{ pt: 0 }}>
            Search and add films
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
                  disabled={
                    searchFilmStatus === 'loading' ||
                    addFilmStatus === 'loading'
                  }
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
              <form
                action={submitAction}
                method="POST"
                onSubmit={(event) => event.preventDefault()}
              >
                <input type="hidden" name="action" value="addFilmByTmdbId" />
                <List dense>
                  {searchResults.map((film) => (
                    <ListItem
                      button
                      type="submit"
                      name="tmdbId"
                      value={film.tmdbId}
                      disabled={addFilmStatus === 'loading'}
                      component="button"
                      key={film.tmdbId}
                      onClick={() => onAddFilmClick(film.tmdbId.toString())}
                    >
                      <ListItemText>
                        {`${film.name} (${
                          film.releaseDate
                            ? film.releaseDate.slice(0, 4)
                            : 'n/a'
                        })`}
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
