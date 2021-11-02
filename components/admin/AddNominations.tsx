import React, { ReactElement, useRef, useState } from 'react';
import { CircularProgress, Typography, TextField, Box, Button, Paper } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { StatusMessage } from 'types/utilityTypes';
import { Category, CategoryId, Film, FilmId, Year } from 'types/nominations';
import { AddNominationsFields } from 'types/admin.types';
import { Alert } from '@mui/material';
import { NominationFields } from './NominationFields';
import { parseFormData } from 'utils/parseFormData';
import { createNominations } from 'services/local';

const useStyles = makeStyles(() => ({
  sectionHeading: {
    paddingTop: 0
  }
}));

interface Props {
  submitAction: string;
  parentStatusMessage?: StatusMessage;
  initialNominationCount: number;
  availableYears: Year[];
  availableCategories: Category[];
  availableFilms: Film[];
}

export const AddNominations: React.FC<Props> = (props) => {
  const { sectionHeading } = useStyles(props);
  const {
    submitAction,
    parentStatusMessage,
    initialNominationCount,
    availableYears,
    availableCategories,
    availableFilms
  } = props;

  const [statusMessage, setStatusMessage] = useState(parentStatusMessage);

  const nominationCountElement = useRef<HTMLInputElement>(null);
  const [nominationCount, setNominationCount] = useState(
    initialNominationCount
  );
  const onUpdateNominationCount: React.MouseEventHandler<HTMLButtonElement> = (
    event
  ) => {
    event.preventDefault();
    const nominationCount = nominationCountElement.current.value;

    if (nominationCount) {
      setNominationCount(parseInt(nominationCount, 10));
    }
  };

  const [addNominationsStatus, setAddNominationsStatus] = useState<
    'idle' | 'loading'
  >('idle');
  const onAddNominationsSubmit: React.FormEventHandler<HTMLFormElement> =
    async (event) => {
      event.preventDefault();
      const target = event.currentTarget;
      setAddNominationsStatus('loading');
      setStatusMessage(null);
      const formData = parseFormData<AddNominationsFields>(
        new FormData(event.currentTarget)
      );
      const saveNominationsResult = await createNominations({
        category: formData.category as CategoryId,
        year: parseInt(formData.year, 10),
        films: formData.films as FilmId[],
        nominees: formData.nominees
      });
      setStatusMessage(saveNominationsResult);
      if (saveNominationsResult.severity !== 'error') {
        target.reset();
      }
      setAddNominationsStatus('idle');
    };

  const renderNominationFields = (availableFilms: Film[], count: number) => {
    let elements: ReactElement[] = [];
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

  return (
    <Box mt={2}>
      <Paper>
        <Box p={2}>
          <Typography variant="h2" className={sectionHeading}>
            Add nominations
          </Typography>
          <Box mt={2}>
            <form
              action={submitAction}
              method="POST"
              onSubmit={onAddNominationsSubmit}
            >
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
                  <option key={year.id} value={year.year}>
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
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </TextField>
              </Box>
              <Box ml={2} display="inline">
                <TextField
                  id="nominationCount"
                  name="nominationCount"
                  label="Nomination count"
                  variant="outlined"
                  size="small"
                  defaultValue={nominationCount}
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
                <Button
                  name="action"
                  value="changeNominationCount"
                  variant="contained"
                  color="primary"
                  type="submit"
                  onClick={onUpdateNominationCount}
                  disabled={addNominationsStatus === 'loading'}
                  disableElevation
                >
                  Update
                </Button>
              </Box>
              {renderNominationFields(availableFilms, nominationCount)}
              <Box mt={2}>
                <Button
                  name="action"
                  value="addNominations"
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={addNominationsStatus === 'loading'}
                  disableElevation
                >
                  Save
                </Button>
              </Box>
              {addNominationsStatus === 'loading' && (
                <Box mt={2.5}>
                  <CircularProgress size={'2rem'} />
                </Box>
              )}
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
