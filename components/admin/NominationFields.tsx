'use client';

import { Input } from '@/components/ui/input';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { cn } from '@/lib/utils';
import { Film } from 'types/nominations';

const nativeSelectClassName = cn(
  'flex h-9 w-full min-w-[12rem] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none',
  'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
  'disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30'
);

interface Props {
  availableFilms: Film[];
  index: number;
}

export const NominationFields = ({ availableFilms, index }: Props) => {
  return (
    <FieldGroup className="mt-4 flex flex-row flex-wrap items-end gap-4">
      <Field className="min-w-[12rem] flex-1">
        <FieldLabel htmlFor={`film-${index}`}>Film</FieldLabel>
        <select
          id={`film-${index}`}
          name="films"
          className={nativeSelectClassName}
        >
          {availableFilms.map((film) => (
            <option key={film.imdbId} value={film.imdbId}>
              {`${film.name} ${
                film.releaseDate &&
                `(${new Date(film.releaseDate).getFullYear()})`
              }`}
            </option>
          ))}
        </select>
      </Field>
      <Field className="min-w-[10rem] flex-1">
        <FieldLabel htmlFor={`nominee-${index}`}>Nominee</FieldLabel>
        <Input id={`nominee-${index}`} name={`nominees`} />
      </Field>
    </FieldGroup>
  );
};
