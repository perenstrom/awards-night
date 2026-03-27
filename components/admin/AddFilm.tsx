'use client';

import React, { RefObject, useEffect, useRef, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Alert } from 'components/base/Alert';
import { createFilm } from '../../app/admin/actions';

const FormContent: React.FC<{
  inputRef: RefObject<HTMLInputElement | null>;
}> = ({ inputRef }) => {
  const { pending } = useFormStatus();

  return (
    <>
      <FieldGroup className="flex flex-row flex-wrap items-end gap-4">
        <Field className="min-w-[12rem] max-w-md flex-1">
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
      </FieldGroup>
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
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-xl">Add film</CardTitle>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
};
