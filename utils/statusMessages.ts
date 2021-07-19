import { Severity, StatusMessage } from 'types/utilityTypes';

export const getStatusMessage = (
  severity: Severity,
  message: string
): StatusMessage => {
  return {
    severity,
    message
  };
};

export const getGenericErrorMessage = () => {
  return getStatusMessage('error', 'Something went wrong, please try again.');
};
