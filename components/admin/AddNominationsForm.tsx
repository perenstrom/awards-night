'use client';
import React, {
  ReactElement,
  useEffect,
  useMemo,
  useState,
  useActionState
} from 'react';
import { useFormStatus } from 'react-dom';
import { BaseYear, Category, Film } from 'types/nominations';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Field, FieldLabel } from '@/components/ui/field';
import { AdminFieldRow } from 'components/admin/AdminFieldRow';
import { AdminSection } from 'components/admin/AdminSection';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Alert } from 'components/base/Alert';
import {
  createNominations,
  setNominationsCount
} from '../../app/admin/actions';
import { NominationFields } from './NominationFields';

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
  const [nominationCount, setNominationCount] = useState(5);
  const [nominationCountResult, setNominationsAction] = useActionState(
    setNominationsCount,
    null
  );
  const [nominationCountSelectValue, setNominationCountSelectValue] = useState(
    String(nominationCount)
  );

  const [selectedYear, setSelectedYear] = useState<number>(
    availableYears[0]?.year || new Date().getFullYear()
  );

  useEffect(() => {
    if (nominationCountResult) {
      setNominationCountSelectValue(String(nominationCountResult));
    }
  }, [nominationCountResult]);

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
    setNominationCount(parseInt(nominationCountSelectValue, 10));
  };

  const [statusMessage, formAction] = useActionState(createNominations, null);
  const formElement = React.useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (statusMessage?.severity !== 'error' && formElement.current) {
      formElement.current.reset();
    }
  }, [statusMessage]);

  return (
    <AdminSection title="Add nominations">
        <form action={setNominationsAction}>
          <AdminFieldRow>
            <Field className="min-w-48">
              <FieldLabel htmlFor="nominationCount">Nomination count</FieldLabel>
              <Select
                name="nominationCount"
                value={nominationCountSelectValue}
                onValueChange={setNominationCountSelectValue}
              >
                <SelectTrigger id="nominationCount" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((count) => (
                    <SelectItem
                      key={`category-count-${count}`}
                      value={String(count)}
                    >
                      {`${count} nominations`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <SaveNominationCountButton
              onUpdateNominationCount={onUpdateNominationCount}
            />
          </AdminFieldRow>
        </form>
        <div className="mt-4">
          <form action={formAction} ref={formElement}>
            <AdminFieldRow>
              <Field className="min-w-32">
                <FieldLabel htmlFor="year">Year</FieldLabel>
                <Select
                  name="year"
                  value={String(selectedYear)}
                  onValueChange={(value) => setSelectedYear(parseInt(value, 10))}
                >
                  <SelectTrigger id="year" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableYears.map((year) => (
                      <SelectItem key={year.year} value={String(year.year)}>
                        {year.year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field className="min-w-48 flex-1">
                <FieldLabel htmlFor="category">Category</FieldLabel>
                <Select
                  name="category"
                  defaultValue={filteredCategories[0]?.slug}
                >
                  <SelectTrigger id="category" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCategories.map((category) => (
                      <SelectItem key={category.slug} value={category.slug}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </AdminFieldRow>
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
    </AdminSection>
  );
};
