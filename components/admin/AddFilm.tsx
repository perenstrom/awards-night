'use client';

import React, { RefObject, useEffect, useRef, useActionState } from 'react';
import { Box, Paper, Alert } from '@mui/material';
import { useFormStatus } from 'react-dom';
import { Button } from 'components/base/Button';
import { InputField } from 'components/base/InputField';
import { LoadingSpinner } from 'components/base/LoadingSpinner';
import { Typography } from 'components/base/Typography';
import { createFilm } from '../../app/admin/actions';
import styles from './AddFilm.module.scss';

const FormContent: React.FC<{
  inputRef: RefObject<HTMLInputElement | null>;
}> = ({ inputRef }) => {
  const { pending } = useFormStatus();

  return (
    <>
      <div className={styles.formWrapper}>
        <InputField id="imdb-id" inputRef={inputRef} name="imdbId" />
        <Button
          name="action"
          value="addFilmByImdbId"
          color="primary"
          type="submit"
          disabled={pending}
        >
          Add
        </Button>
        {pending && <LoadingSpinner />}
      </div>
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
          <Typography variant="h2">Add film</Typography>
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
