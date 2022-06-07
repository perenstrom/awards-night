import { ErrorMessage } from 'types/utilityTypes';

export const ERROR_CODES = {
  API_RESULT_401: 'APR401',
  API_RESULT_404: 'APR404',
  API_RESULT_UNHANDLED_CODE: 'APRUNH',
  API_RESULT_UNHANDLED_EXCEPTION: 'APREXC'
} as const;

const errorMessages = {
  [ERROR_CODES.API_RESULT_401]: 'API result returned 401 error.',
  [ERROR_CODES.API_RESULT_404]: 'API result returned 404 error.',
  [ERROR_CODES.API_RESULT_UNHANDLED_CODE]:
    'API result returned unhandled code.',
  [ERROR_CODES.API_RESULT_UNHANDLED_EXCEPTION]:
    'API result encountered an unhandled exception.'
};

export const getError = (
  errorCode: keyof typeof errorMessages
): ErrorMessage => ({
  code: errorCode,
  message: errorMessages[errorCode]
});
