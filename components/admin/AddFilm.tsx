'use client';

import React, { RefObject, useEffect, useRef, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Field, FieldLabel } from '@/components/ui/field';
import { Alert } from 'components/base/Alert';
import { AdminSection } from 'components/admin/AdminSection';
import { AdminFieldRow } from 'components/admin/AdminFieldRow';
import { createFilm } from '../../app/admin/actions';

const FormContent: React.FC<{
  inputRef: RefObject<HTMLInputElement | null>;
}> = ({ inputRef }) => {
  const { pending } = useFormStatus();

  return (
    <>
      <AdminFieldRow>
        <Field className="min-w-48 max-w-md flex-1">
          <FieldLabel htmlFor="imdb-id">IMDb ID</FieldLabel>
          <Input ref={inputRef} id="imdb-id" name="imdbId" />
        </Field>
        <Button
          name="action"
          value="addFilmByImdbId"
          type="submit"
          disabled={pending}
        >
          Add
        </Button>
        {pending && <Spinner className="size-8" />}
      </AdminFieldRow>
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
    <AdminSection title="Add film">
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
    </AdminSection>
  );
};
