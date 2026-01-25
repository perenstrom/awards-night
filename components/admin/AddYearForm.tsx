'use client';

import React, { RefObject, useEffect, useRef, useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Category } from 'types/nominations';
import { Button } from 'components/base/Button';
import { InputField } from 'components/base/InputField';
import { LoadingSpinner } from 'components/base/LoadingSpinner';
import { Typography } from 'components/base/Typography';
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
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <InputField
            id="year"
            inputRef={yearInputRef}
            name="year"
            label="Year"
            type="number"
            min={1900}
            max={2100}
            required
            placeholder="2025"
          />
          <InputField
            id="name"
            inputRef={nameInputRef}
            name="name"
            label="Name"
            type="text"
            required
            placeholder="97th Academy Awards"
          />
          <InputField
            id="date"
            inputRef={dateInputRef}
            name="date"
            label="Date"
            type="date"
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Typography variant="h3">Categories</Typography>
            <Button
              type="button"
              color="secondary"
              onClick={onToggleAll}
              disabled={pending}
            >
              {allSelected ? 'Deselect All' : 'Select All'}
            </Button>
          </div>
          <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {categories.map((category) => (
              <div key={category.slug} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`category-${category.slug}`}
                  name="categories"
                  value={category.slug}
                  className="w-4 h-4 category-checkbox"
                />
                <label
                  htmlFor={`category-${category.slug}`}
                  className="text-sm"
                >
                  {category.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button type="submit" color="primary" disabled={pending}>
            Create Year
          </Button>
          {pending && <LoadingSpinner />}
        </div>
      </div>
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
      // Clear form on success
      if (yearInputRef.current) yearInputRef.current.value = '';
      if (nameInputRef.current) nameInputRef.current.value = '';
      if (dateInputRef.current) dateInputRef.current.value = '';

      // Uncheck all category checkboxes
      const checkboxes = document.querySelectorAll(
        'input[name="categories"]'
      );
      checkboxes.forEach((checkbox) => {
        (checkbox as HTMLInputElement).checked = false;
      });

      // Reset allSelected state
      setAllSelected(false);

      // Focus on year input
      if (yearInputRef.current) yearInputRef.current.focus();
    }
  }, [statusMessage]);

  return (
    <div className="mt-4 p-4 rounded-md bg-white">
      <Typography variant="h2">Add year</Typography>
      <div className="mt-4">
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
      </div>
    </div>
  );
};
