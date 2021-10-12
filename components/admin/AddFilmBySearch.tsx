import React, { useState } from 'react';
import {
  CircularProgress,
  Typography,
  TextField,
  Box,
  Button,
  makeStyles,
  Paper,
  TableContainer,
  TableRow,
  TableCell,
  Table,
  TableBody
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { StatusMessage } from 'types/utilityTypes';
import { TmdbFilmResult } from 'types/nominations';

const useStyles = makeStyles(() => ({
  sectionHeading: {
    paddingTop: 0
  }
}));

interface Props {
  submitAction: string;
  searchResults: TmdbFilmResult[];
  parentStatusMessage?: StatusMessage;
}

export const AddFilmBySearch: React.FC<Props> = (props) => {
  const { sectionHeading } = useStyles(props);
  const {
    submitAction,
    searchResults: initialSearchResults,
    parentStatusMessage
  } = props;

  const [statusMessage, setStatusMessage] = useState(parentStatusMessage);
  const [searchResults, setSearchResults] = useState(initialSearchResults);

  const [searchFilmStatus, setSearchFilmStatus] = useState<'idle' | 'loading'>(
    'idle'
  );

  return (
    <Box mt={2}>
      <Paper>
        <Box p={2}>
          <Typography variant="h2" className={sectionHeading}>
            Search films
          </Typography>
          <Box mt={2}>
            <form action={submitAction} method="POST" onSubmit={null}>
              <TextField
                id="filmQuery"
                name="filmQuery"
                label="Film name"
                variant="outlined"
                size="small"
                inputRef={null}
              />
              <Box ml={1} display="inline">
                <Button
                  name="action"
                  value="searchFilms"
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={searchFilmStatus === 'loading'}
                  disableElevation
                >
                  Search
                </Button>
              </Box>
              {searchFilmStatus === 'loading' && (
                <Box mt={2.5}>
                  <CircularProgress size={'2rem'} />
                </Box>
              )}
            </form>
            <TableContainer>
              <Table>
                <TableBody>
                  {searchResults.map((film) => (
                    <TableRow key={film.tmdbId}>
                      <TableCell>{film.name}</TableCell>
                      <TableCell>{film.releaseDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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
