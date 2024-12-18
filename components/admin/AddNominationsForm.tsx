'use client';
import React, { ReactElement, useEffect, useRef, useState, useActionState } from 'react';
import {
  CircularProgress,
  Typography,
  TextField,
  Box,
  Button,
  Paper,
  Alert
} from '@mui/material';
import { useFormStatus } from 'react-dom';
import { Category, Film, Year } from 'types/nominations';
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
        first={i === 0}
        key={`nomination-fields-${i}`}
      />
    );
  }

  return elements;
};

const LoadingSpinner: React.FC<{}> = () => {
  const { pending } = useFormStatus();

  return (
    pending && (
      <Box mt={2.5}>
        <CircularProgress size={'2rem'} />
      </Box>
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
      variant="contained"
      color="primary"
      type="submit"
      onClick={onUpdateNominationCount}
      disabled={pending}
      disableElevation
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
      variant="contained"
      color="primary"
      type="submit"
      disabled={pending}
      disableElevation
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
  const nominationCountElement = useRef<HTMLInputElement>(null);

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
    <Box mt={2}>
      <Paper>
        <Box p={2}>
          <Typography variant="h2" sx={{ pt: 0 }}>
            Add nominations
          </Typography>
          <Box mt={2}>
            <form action={setNominationsAction}>
              <Box display="inline">
                <TextField
                  id="nominationCount"
                  name="nominationCount"
                  label="Nomination count"
                  variant="outlined"
                  size="small"
                  defaultValue={nominationCountResult || nominationCount}
                  SelectProps={{
                    native: true
                  }}
                  select
                  inputRef={nominationCountElement}
                >
                  {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((count) => (
                    <option key={`category-count-${count}`} value={count}>
                      {`${count} nominations`}
                    </option>
                  ))}
                </TextField>
              </Box>
              <Box ml={1} display="inline">
                <SaveNominationCountButton
                  onUpdateNominationCount={onUpdateNominationCount}
                />
              </Box>
            </form>
          </Box>
          <Box mt={2}>
            <form action={formAction} ref={formElement}>
              <TextField
                id="year"
                name="year"
                label="Year"
                variant="outlined"
                size="small"
                SelectProps={{
                  native: true
                }}
                select
              >
                {availableYears.map((year) => (
                  <option key={year.year} value={year.year}>
                    {year.year}
                  </option>
                ))}
              </TextField>
              <Box ml={1} display="inline">
                <TextField
                  id="category"
                  name="category"
                  label="Category"
                  variant="outlined"
                  size="small"
                  SelectProps={{
                    native: true
                  }}
                  select
                >
                  {availableCategories.map((category) => (
                    <option key={category.slug} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </TextField>
              </Box>
              {renderNominationFields(
                availableFilms,
                nominationCountResult || nominationCount
              )}
              <Box mt={2}>
                <SaveButton />
              </Box>
              <LoadingSpinner />
            </form>
            {statusMessage && (
              <Box mt={2}>
                <Alert severity={statusMessage.severity}>
                  {statusMessage.message}
                </Alert>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
