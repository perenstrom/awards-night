import React from 'react';
import { Box, Grid, TextField } from '@mui/material';
import { Film } from 'types/nominations';

interface Props {
  availableFilms: Film[];
  index: number;
  first?: boolean;
}

export const NominationFields: React.FC<Props> = ({
  availableFilms,
  index,
  first
}) => {
  return (
    <Box mt={first ? 2 : 1}>
      <Grid container spacing={1}>
        <Grid item xs>
          <TextField
            id={`film-${index}`}
            name={`films`}
            label="Film"
            variant="outlined"
            size="small"
            SelectProps={{
              native: true
            }}
            select
            fullWidth
          >
            {availableFilms.map((film) => (
              <option key={film.id} value={film.id}>
                {film.name}
              </option>
            ))}
          </TextField>
        </Grid>
        <Grid item xs>
          <TextField
            id={`nominee-${index}`}
            name={`nominees`}
            label="Nominee"
            variant="outlined"
            size="small"
            fullWidth
          />
        </Grid>
      </Grid>
    </Box>
  );
};
