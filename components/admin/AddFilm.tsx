'use client';

import React, { RefObject, useEffect, useRef, useActionState } from 'react';
import {
  Typography,
  TextField,
  Box,
  Button,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import { useFormStatus } from 'react-dom';
import { createFilm } from '../../app/admin/actions';

const FormContent: React.FC<{ inputRef: RefObject<HTMLInputElement | null> }> = ({
  inputRef
}) => {
  const { pending } = useFormStatus();

  return (
    <>
      <TextField
        id="imdb-id"
        name="imdbId"
        label="IMDb ID"
        variant="outlined"
        size="small"
        inputProps={{
          minLength: '9',
          maxLength: '10',
          pattern: 'tt[0-9]{7-8}'
        }}
        inputRef={inputRef}
      />
      <Box ml={1} display="inline">
        <Button
          name="action"
          value="addFilmByImdbId"
          variant="contained"
          color="primary"
          type="submit"
          disabled={pending}
          disableElevation
        >
          Add
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

export const AddFilm: React.FC<{}> = () => {
  const [statusMessage, createFilmAction] = useActionState(createFilm, null);
  const imdbIdInputElement = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (statusMessage?.severity !== 'error' && imdbIdInputElement.current) {
      imdbIdInputElement.current.value = '';
      imdbIdInputElement.current.focus();
    }
  }, [statusMessage]);

  return (
    <Box mt={2}>
      <Paper>
        <Box p={2}>
          <Typography variant="h2" sx={{ pt: 0 }}>
            Add film
          </Typography>
          <Box mt={2}>
            <form action={createFilmAction}>
              <FormContent inputRef={imdbIdInputElement} />
            </form>
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
