'use client';
import React, {
  ReactElement,
  useEffect,
  useRef,
  useState,
  useActionState
} from 'react';
import { useFormStatus } from 'react-dom';
import { Category, Film, Year } from 'types/nominations';
import { Button } from 'components/base/Button';
import { Typography } from 'components/base/Typography';
import { LoadingSpinner } from 'components/base/LoadingSpinner';
import { Alert } from 'components/base/Alert';
import {
  createNominations,
  setNominationsCount
} from '../../app/admin/actions';
import { NominationFields } from './NominationFields';

const renderNominationFields = (availableFilms: Film[], count: number) => {
  let elements: ReactElement<any>[] = [];
  for (let i = 0; i < count; i++) {
    elements.push(
      <NominationFields
        availableFilms={availableFilms}
        index={i}
        key={`nomination-fields-${i}`}
      />
    );
  }

  return elements;
};

const LoadingSpinnerWrapper: React.FC<{}> = () => {
  const { pending } = useFormStatus();

  return (
    pending && (
      <div className="mt-6">
        <LoadingSpinner />
      </div>
    )
  );
};

const SaveNominationCountButton: React.FC<{
  onUpdateNominationCount: React.MouseEventHandler<HTMLButtonElement>;
}> = ({ onUpdateNominationCount }) => {
  const { pending } = useFormStatus();

  return (
    <Button
      name="action"
      value="changeNominationCount"
      color="primary"
      type="submit"
      onClick={onUpdateNominationCount}
      disabled={pending}
    >
      Update
    </Button>
  );
};

const SaveButton: React.FC<{}> = () => {
  const { pending } = useFormStatus();

  return (
    <Button
      name="action"
      value="addNominations"
      color="primary"
      type="submit"
      disabled={pending}
    >
      Save
    </Button>
  );
};

interface Props {
  availableYears: Year[];
  availableCategories: Category[];
  availableFilms: Film[];
}
export const AddNominationsForm: React.FC<Props> = ({
  availableYears,
  availableCategories,
  availableFilms
}) => {
  const nominationCountElement = useRef<HTMLSelectElement>(null);

  const [nominationCount, setNominationCount] = useState(5);
  const [nominationCountResult, setNominationsAction] = useActionState(
    setNominationsCount,
    null
  );

  const onUpdateNominationCount: React.MouseEventHandler<HTMLButtonElement> = (
    event
  ) => {
    event.preventDefault();
    const nominationCount = nominationCountElement.current?.value;

    if (nominationCount) {
      setNominationCount(parseInt(nominationCount, 10));
    }
  };

  const [statusMessage, formAction] = useActionState(createNominations, null);
  const formElement = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (statusMessage?.severity !== 'error' && formElement.current) {
      formElement.current.reset();
    }
  }, [statusMessage]);

  return (
    <div className="mt-4 p-4 rounded-md bg-white">
      <Typography variant="h2">Add nominations</Typography>
      <form action={setNominationsAction}>
        <div className="flex items-end gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="nominationCount">Nomination count</label>
            <select
              id="nominationCount"
              name="nominationCount"
              defaultValue={nominationCountResult || nominationCount}
              ref={nominationCountElement}
              className="border border-gray-300 rounded-md p-2 hover:border-black"
            >
              {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((count) => (
                <option key={`category-count-${count}`} value={count}>
                  {`${count} nominations`}
                </option>
              ))}
            </select>
          </div>
          <SaveNominationCountButton
            onUpdateNominationCount={onUpdateNominationCount}
          />
        </div>
      </form>
      <div className="mt-4">
        <form action={formAction} ref={formElement}>
          <div className="flex gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="year">Year</label>
              <select
                id="year"
                name="year"
                className="border border-gray-300 rounded-md p-2 hover:border-black"
              >
                {availableYears.map((year) => (
                  <option key={year.year} value={year.year}>
                    {year.year}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                className="border border-gray-300 rounded-md p-2 hover:border-black"
              >
                {availableCategories.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {renderNominationFields(
            availableFilms,
            nominationCountResult || nominationCount
          )}
          <div className="mt-4">
            <SaveButton />
          </div>
          <LoadingSpinnerWrapper />
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
