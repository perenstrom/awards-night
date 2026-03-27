'use client';
import React, {
  ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  useActionState
} from 'react';
import { useFormStatus } from 'react-dom';
import { BaseYear, Category, Film } from 'types/nominations';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Alert } from 'components/base/Alert';
import {
  createNominations,
  setNominationsCount
} from '../../app/admin/actions';
import { NominationFields } from './NominationFields';

const nativeSelectClassName = cn(
  'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none',
  'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
  'disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30'
);

const renderNominationFields = (availableFilms: Film[], count: number) => {
  const elements: ReactElement<React.JSX.Element>[] = [];
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

const LoadingSpinnerWrapper = () => {
  const { pending } = useFormStatus();

  return (
    pending && (
      <div className="mt-6">
        <Spinner className="size-8" />
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
      type="submit"
      onClick={onUpdateNominationCount}
      disabled={pending}
    >
      Update
    </Button>
  );
};

const SaveButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button
      name="action"
      value="addNominations"
      type="submit"
      disabled={pending}
    >
      Save
    </Button>
  );
};

interface Props {
  availableYears: BaseYear[];
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

  const [selectedYear, setSelectedYear] = useState<number>(
    availableYears[0]?.year || new Date().getFullYear()
  );

  const filteredFilms = useMemo(() => {
    return availableFilms.filter((film) => {
      if (!film.releaseDate) {
        return false;
      }

      const releaseYear = new Date(film.releaseDate).getFullYear();

      return (
        releaseYear === selectedYear ||
        releaseYear === selectedYear - 1 ||
        releaseYear === selectedYear - 2
      );
    });
  }, [availableFilms, selectedYear]);

  const filteredCategories = useMemo(() => {
    return availableCategories.filter((category) => {
      if (!category.years || category.years.length === 0) {
        return true;
      }
      return category.years.includes(selectedYear);
    });
  }, [availableCategories, selectedYear]);

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
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-xl">Add nominations</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={setNominationsAction}>
          <FieldGroup className="flex flex-row flex-wrap items-end gap-4">
            <Field className="min-w-[12rem]">
              <FieldLabel htmlFor="nominationCount">Nomination count</FieldLabel>
              <select
                id="nominationCount"
                name="nominationCount"
                defaultValue={nominationCountResult || nominationCount}
                ref={nominationCountElement}
                className={nativeSelectClassName}
              >
                {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((count) => (
                  <option key={`category-count-${count}`} value={count}>
                    {`${count} nominations`}
                  </option>
                ))}
              </select>
            </Field>
            <SaveNominationCountButton
              onUpdateNominationCount={onUpdateNominationCount}
            />
          </FieldGroup>
        </form>
        <div className="mt-4">
          <form action={formAction} ref={formElement}>
            <FieldGroup className="flex flex-row flex-wrap gap-4">
              <Field className="min-w-[8rem]">
                <FieldLabel htmlFor="year">Year</FieldLabel>
                <select
                  id="year"
                  name="year"
                  className={nativeSelectClassName}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                  value={selectedYear}
                >
                  {availableYears.map((year) => (
                    <option key={year.year} value={year.year}>
                      {year.year}
                    </option>
                  ))}
                </select>
              </Field>
              <Field className="min-w-[12rem] flex-1">
                <FieldLabel htmlFor="category">Category</FieldLabel>
                <select
                  id="category"
                  name="category"
                  className={nativeSelectClassName}
                >
                  {filteredCategories.map((category) => (
                    <option key={category.slug} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </Field>
            </FieldGroup>
            {renderNominationFields(
              filteredFilms,
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
      </CardContent>
    </Card>
  );
};
