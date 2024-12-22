import React from 'react';
import { Film } from 'types/nominations';
import { InputField } from 'components/base/InputField';

interface Props {
  availableFilms: Film[];
  index: number;
}

export const NominationFields: React.FC<Props> = ({
  availableFilms,
  index
}) => {
  return (
    <div className="flex flex-wrap items-end gap-4 mt-4">
      <div className="flex flex-col gap-1">
        <label htmlFor={`film-${index}`}>Film</label>
        <select
          id={`film-${index}`}
          name="films"
          className="border border-gray-300 rounded-md p-2 hover:border-black"
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
      </div>
      <InputField id={`nominee-${index}`} name={`nominees`} label="Nominee" />
    </div>
  );
};
