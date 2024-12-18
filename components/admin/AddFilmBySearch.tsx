'use client';

import React, { useEffect, useRef, useState, useActionState } from 'react';
import {
  Typography,
  TextField,
  Box,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Alert,
  CircularProgress
} from '@mui/material';
import { useFormStatus } from 'react-dom';
import { Nullable, StatusMessage } from 'types/utilityTypes';
import { TmdbFilmResult } from 'types/nominations';
import { createFilmByTmdb, searchFilms } from '../../app/admin/actions';

const SearchFormContent: React.FC<{
  inputRef: React.RefObject<HTMLInputElement | null>;
}> = ({ inputRef }) => {
  const { pending } = useFormStatus();

  return (
    <>
      <TextField
        id="filmQuery"
        name="filmQuery"
        label="Film name"
        variant="outlined"
        size="small"
        inputRef={inputRef}
      />
      <Box ml={1} display="inline">
        <Button
          name="action"
          value="searchFilms"
          variant="contained"
          color="primary"
          type="submit"
          disabled={pending}
          disableElevation
        >
          Search
        </Button>
      </Box>
      {pending && (
        <Box mt={2.5}>
          <CircularProgress size={'2rem'} />
        </Box>
      )}
    </>
  );
};

const SearchResult: React.FC<{ film: TmdbFilmResult }> = ({ film }) => {
  const { pending } = useFormStatus();

  return (
    <ListItem
      button
      type="submit"
      name="tmdbId"
      value={film.tmdbId}
      disabled={pending}
      component="button"
      key={film.tmdbId}
    >
      <ListItemText>
        {`${film.name} (${
          film.releaseDate ? film.releaseDate.slice(0, 4) : 'n/a'
        })`}
      </ListItemText>
    </ListItem>
  );
};

export const AddFilmBySearch: React.FC<{}> = () => {
  const [searchResultsResponse, searchAction] = useActionState(searchFilms, null);
  const [statusMessageCreate, saveAction] = useActionState(
    createFilmByTmdb,
    null
  );

  const [statusMessage, setStatusMessage] =
    useState<Nullable<StatusMessage>>(null);
  const [searchResults, setSearchResults] =
    useState<Nullable<TmdbFilmResult[]>>(null);

  useEffect(() => {
    if (searchResultsResponse && !searchResultsResponse.success) {
      setStatusMessage({
        severity: 'error',
        message: searchResultsResponse.error.message
      });
    }

    if (searchResultsResponse && searchResultsResponse.success) {
      setSearchResults(searchResultsResponse.data);
      setStatusMessage(null);
    }
  }, [searchResultsResponse]);

  const searchFilmInputElement = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (
      statusMessageCreate?.severity !== 'error' &&
      searchFilmInputElement.current
    ) {
      setSearchResults([]);
      searchFilmInputElement.current.value = '';
      searchFilmInputElement.current.focus();
    }

    if (statusMessageCreate) setStatusMessage(statusMessageCreate);
  }, [statusMessageCreate]);

  return (
    <Box mt={2}>
      <Paper>
        <Box p={2}>
          <Typography variant="h2" sx={{ pt: 0 }}>
            Search and add films
          </Typography>
          <Box mt={2}>
            <form action={searchAction}>
              <SearchFormContent inputRef={searchFilmInputElement} />
            </form>
            {searchResults && searchResults.length > 0 && (
              <form action={saveAction}>
                <List dense>
                  {searchResults.map((film) => (
                    <SearchResult film={film} key={film.tmdbId} />
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
