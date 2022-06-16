import { ErrorMessage, ErrorResult, SuccessResult } from 'types/utilityTypes';

export const createSuccess = <T>(data: T): SuccessResult<T> => ({
  success: true,
  data: data
});

export const createError = (error: ErrorMessage): ErrorResult => ({
  success: false,
  error: error
});
