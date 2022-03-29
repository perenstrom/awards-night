import React, { FormEvent, useRef, useState } from 'react';
import {
  CircularProgress,
  Typography,
  TextField,
  Box,
  Button,
  Paper
} from '@mui/material';
import { Alert } from '@mui/material';
import { Nullable, StatusMessage } from 'types/utilityTypes';
import { createFilm } from 'services/local';

interface Props {
  submitAction: string;
  parentStatusMessage?: StatusMessage;
}

export const AddFilm: React.FC<Props> = (props) => {
  const { submitAction, parentStatusMessage } = props;

  const [statusMessage, setStatusMessage] =
    useState<Nullable<StatusMessage>>(parentStatusMessage);

  const imdbIdInputElement = useRef<HTMLInputElement>(null);
  const [addFilmStatus, setAddFilmStatus] = useState<'idle' | 'loading'>(
    'idle'
  );
  const onAddFilmSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setAddFilmStatus('loading');
    setStatusMessage(null);
    const imdbId = imdbIdInputElement.current?.value;

    if (imdbId) {
      const saveFilmResult = await createFilm(imdbId);
      setStatusMessage(saveFilmResult);
      if (saveFilmResult.severity !== 'error') {
        imdbIdInputElement.current.value = '';
        imdbIdInputElement.current.focus();
      }
    }
    setAddFilmStatus('idle');
  };

  return (
    <Box mt={2}>
      <Paper>
        <Box p={2}>
          <Typography variant="h2" sx={{ pt: 0 }}>
            Add film
          </Typography>
          <Box mt={2}>
            <form
              action={submitAction}
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
                  maxLength: '10',
                  pattern: 'tt[0-9]{7-8}'
                }}
                inputRef={imdbIdInputElement}
              />
              <Box ml={1} display="inline">
                <Button
                  name="action"
                  value="addFilmByImdbId"
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
