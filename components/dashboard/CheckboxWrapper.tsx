'use client';

import { useFormStatus } from 'react-dom';
import { PredictionCheckbox } from './PredictionCheckbox';

interface Props {
  selected: boolean;
  nominationId: number;
}

export const CheckboxWrapper = ({ selected, nominationId }: Props) => {
  const status = useFormStatus();
  const rawNominationId = status.data?.get('nominationId') as string | null;
  const formNominationId = rawNominationId
    ? parseInt(rawNominationId, 10)
    : null;
  const loading = formNominationId === nominationId && status.pending;

  return <PredictionCheckbox selected={selected} loading={loading} />;
};
