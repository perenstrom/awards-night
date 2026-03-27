'use client';

import React, { RefObject, useEffect, useRef, useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Category } from 'types/nominations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import {
  Field,
  FieldGroup,
  FieldLabel
} from '@/components/ui/field';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Alert } from 'components/base/Alert';
import { createYear } from '../../app/admin/actions';

const FormContent: React.FC<{
  yearInputRef: RefObject<HTMLInputElement | null>;
  nameInputRef: RefObject<HTMLInputElement | null>;
  dateInputRef: RefObject<HTMLInputElement | null>;
  categories: Category[];
  allSelected: boolean;
  onToggleAll: () => void;
}> = ({ yearInputRef, nameInputRef, dateInputRef, categories, allSelected, onToggleAll }) => {
  const { pending } = useFormStatus();

  return (
    <>
      <FieldGroup className="gap-4">
        <FieldGroup className="flex flex-row flex-wrap gap-4 gap-y-4">
          <Field className="min-w-[8rem] flex-1">
            <FieldLabel htmlFor="year">Year</FieldLabel>
            <Input
              ref={yearInputRef}
              id="year"
              name="year"
              type="number"
              min={1900}
              max={2100}
              required
              placeholder="2025"
            />
          </Field>
          <Field className="min-w-[12rem] flex-1">
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              ref={nameInputRef}
              id="name"
              name="name"
              type="text"
              required
              placeholder="97th Academy Awards"
            />
          </Field>
          <Field className="min-w-[10rem] flex-1">
            <FieldLabel htmlFor="date">Date</FieldLabel>
            <Input ref={dateInputRef} id="date" name="date" type="date" required />
          </Field>
        </FieldGroup>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-lg font-semibold leading-tight text-card-foreground">
              Categories
            </h3>
            <Button
              type="button"
              variant="secondary"
              onClick={onToggleAll}
              disabled={pending}
            >
              {allSelected ? 'Deselect All' : 'Select All'}
            </Button>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {categories.map((category) => (
              <Field
                key={category.slug}
                orientation="horizontal"
                className="items-center gap-2"
              >
                <input
                  type="checkbox"
                  id={`category-${category.slug}`}
                  name="categories"
                  value={category.slug}
                  className="category-checkbox size-4 accent-primary"
                />
                <FieldLabel
                  htmlFor={`category-${category.slug}`}
                  className="font-normal"
                >
                  {category.name}
                </FieldLabel>
              </Field>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={pending}>
            Create Year
          </Button>
          {pending && <Spinner className="size-8" />}
        </div>
      </FieldGroup>
    </>
  );
};

interface AddYearFormProps {
  availableCategories: Category[];
}

export const AddYearForm: React.FC<AddYearFormProps> = ({
  availableCategories
}) => {
  const [statusMessage, createYearAction] = useActionState(createYear, null);
  const yearInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [allSelected, setAllSelected] = useState(false);

  const handleToggleAll = () => {
    const checkboxes = document.querySelectorAll(
      '.category-checkbox'
    ) as NodeListOf<HTMLInputElement>;
    const newState = !allSelected;

    checkboxes.forEach((checkbox) => {
      checkbox.checked = newState;
    });

    setAllSelected(newState);
  };

  useEffect(() => {
    if (statusMessage?.severity === 'success') {
      if (yearInputRef.current) yearInputRef.current.value = '';
      if (nameInputRef.current) nameInputRef.current.value = '';
      if (dateInputRef.current) dateInputRef.current.value = '';

      const checkboxes = document.querySelectorAll('input[name="categories"]');
      checkboxes.forEach((checkbox) => {
        (checkbox as HTMLInputElement).checked = false;
      });

      setAllSelected(false);

      if (yearInputRef.current) yearInputRef.current.focus();
    }
  }, [statusMessage]);

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-xl">Add year</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={createYearAction}>
          <FormContent
            yearInputRef={yearInputRef}
            nameInputRef={nameInputRef}
            dateInputRef={dateInputRef}
            categories={availableCategories}
            allSelected={allSelected}
            onToggleAll={handleToggleAll}
          />
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
