import { ErrorMessage } from 'types/utilityTypes';

export const ERROR_CODES = {
  TMDB_SEARCH_ERROR: 'TMDBSRCH'
} as const;

const errorMessages = {
  [ERROR_CODES.TMDB_SEARCH_ERROR]:
    'Something went wrong when searching for films, please try again.'
};

export const getError = (
  errorCode: keyof typeof errorMessages
): ErrorMessage => ({
  code: errorCode,
  message: errorMessages[errorCode]
});
