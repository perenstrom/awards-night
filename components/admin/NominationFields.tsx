'use client';

import { Field, FieldLabel } from '@/components/ui/field';
import { AdminFieldRow } from 'components/admin/AdminFieldRow';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Film } from 'types/nominations';

interface Props {
  availableFilms: Film[];
  index: number;
}

export const NominationFields = ({ availableFilms, index }: Props) => {
  return (
    <AdminFieldRow className="mt-4">
      <Field className="min-w-48 flex-1">
        <FieldLabel htmlFor={`film-${index}`}>Film</FieldLabel>
        <Select name="films" defaultValue={availableFilms[0]?.imdbId}>
          <SelectTrigger id={`film-${index}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {availableFilms.map((film) => (
              <SelectItem key={film.imdbId} value={film.imdbId}>
                {`${film.name}${
                  film.releaseDate
                    ? ` (${new Date(film.releaseDate).getFullYear()})`
                    : ''
                }`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field className="min-w-40 flex-1">
        <FieldLabel htmlFor={`nominee-${index}`}>Nominee</FieldLabel>
        <Input id={`nominee-${index}`} name={`nominees`} />
      </Field>
    </AdminFieldRow>
  );
};
