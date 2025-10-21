'use client';

import React, { useEffect, useRef, useState, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Nullable, StatusMessage } from 'types/utilityTypes';
import { TmdbFilmResult } from 'types/nominations';
import { InputField } from 'components/base/InputField';
import { LoadingSpinner } from 'components/base/LoadingSpinner';
import { Button } from 'components/base/Button';
import { Typography } from 'components/base/Typography';
import { Alert } from 'components/base/Alert';
import { createFilmByTmdb, searchFilms } from '../../app/admin/actions';

const SearchFormContent: React.FC<{
  inputRef: React.RefObject<HTMLInputElement | null>;
}> = ({ inputRef }) => {
  const { pending } = useFormStatus();

  return (
    <>
      <div className="flex items-end gap-4">
        <InputField
          id="filmQuery"
          inputRef={inputRef}
          name="filmQuery"
          label="Film name"
        />
        <Button
          name="action"
          value="searchFilms"
          color="primary"
          type="submit"
          disabled={pending}
        >
          Search
        </Button>
        {pending && <LoadingSpinner />}
      </div>
    </>
  );
};

const SearchResult: React.FC<{ film: TmdbFilmResult }> = ({ film }) => {
  const { pending } = useFormStatus();

  return (
    <li>
      <button
        className="px-4 py-2 w-full text-left hover:bg-gray-100"
        type="submit"
        name="tmdbId"
        value={film.tmdbId}
        disabled={pending}
      >
        {`${film.name} (${
          film.releaseDate ? film.releaseDate.slice(0, 4) : 'n/a'
        })`}
      </button>
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
    <div className="mt-4 p-4 rounded-md bg-white">
      <Typography variant="h2">Search and add films</Typography>
      <div className="mt-4">
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
      </div>
    </div>
  );
};
