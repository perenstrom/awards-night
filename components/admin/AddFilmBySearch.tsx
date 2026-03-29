'use client';

import React, { useEffect, useRef, useState, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Nullable, StatusMessage } from 'types/utilityTypes';
import { TmdbFilmResult } from 'types/nominations';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { Alert } from 'components/base/Alert';
import { AdminSection } from 'components/admin/AdminSection';
import { AdminFieldRow } from 'components/admin/AdminFieldRow';
import { createFilmByTmdb, searchFilms } from '../../app/admin/actions';

const SearchFormContent: React.FC<{
  inputRef: React.RefObject<HTMLInputElement | null>;
}> = ({ inputRef }) => {
  const { pending } = useFormStatus();

  return (
    <>
      <AdminFieldRow>
        <Field className="min-w-48 max-w-md flex-1">
          <FieldLabel htmlFor="filmQuery">Film name</FieldLabel>
          <Input ref={inputRef} id="filmQuery" name="filmQuery" />
        </Field>
        <Button
          name="action"
          value="searchFilms"
          type="submit"
          disabled={pending}
        >
          Search
        </Button>
        {pending && <Spinner className="size-8" />}
      </AdminFieldRow>
    </>
  );
};

const SearchResult: React.FC<{ film: TmdbFilmResult }> = ({ film }) => {
  const { pending } = useFormStatus();

  return (
    <li>
      <Button
        variant="ghost"
        className="h-auto w-full justify-start px-4 py-2 font-normal"
        type="submit"
        name="tmdbId"
        value={film.tmdbId}
        disabled={pending}
      >
        {`${film.name} (${
          film.releaseDate ? film.releaseDate.slice(0, 4) : 'n/a'
        })`}
      </Button>
    </li>
  );
};

export const AddFilmBySearch = () => {
  const [searchResultsResponse, searchAction] = useActionState(
    searchFilms,
    null
  );
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
    <AdminSection title="Search and add films">
      <form action={searchAction}>
        <SearchFormContent inputRef={searchFilmInputElement} />
      </form>
      {searchResults && searchResults.length > 0 && (
        <form action={saveAction}>
          <ul className="mt-4">
            {searchResults.map((film) => (
              <SearchResult film={film} key={film.tmdbId} />
            ))}
          </ul>
        </form>
      )}
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
