'use client';

import React, { RefObject, useEffect, useRef, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from 'components/base/Button';
import { InputField } from 'components/base/InputField';
import { LoadingSpinner } from 'components/base/LoadingSpinner';
import { Typography } from 'components/base/Typography';
import { Alert } from 'components/base/Alert';
import { createFilm } from '../../app/admin/actions';

const FormContent: React.FC<{
  inputRef: RefObject<HTMLInputElement | null>;
}> = ({ inputRef }) => {
  const { pending } = useFormStatus();

  return (
    <>
      <div className="flex items-end gap-4">
        <InputField
          id="imdb-id"
          inputRef={inputRef}
          name="imdbId"
          label="IMDb ID"
        />
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

export const AddFilm = () => {
  const [statusMessage, createFilmAction] = useActionState(createFilm, null);
  const imdbIdInputElement = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (statusMessage?.severity !== 'error' && imdbIdInputElement.current) {
      imdbIdInputElement.current.value = '';
      imdbIdInputElement.current.focus();
    }
  }, [statusMessage]);

  return (
    <div className="mt-4 p-4 rounded-md bg-white">
      <Typography variant="h2">Add film</Typography>
      <div className="mt-4">
        <form action={createFilmAction}>
          <FormContent inputRef={imdbIdInputElement} />
        </form>
        {statusMessage && (
          <div className="mt-4">
            <Alert
              severity={statusMessage.severity}
              message={statusMessage.message}
            />
          </div>
        )}
      </div>
    </div>
  );
};
