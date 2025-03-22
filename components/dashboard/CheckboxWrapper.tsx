'use client';

import { useFormStatus } from 'react-dom';
import { PredictionCheckbox } from './PredictionCheckbox';

interface Props {
  selected: boolean;
  nominationId: number;
  state: 'neutral' | 'correct' | 'incorrect';
}

export const CheckboxWrapper = ({
  selected,
  nominationId,
  state = 'neutral'
}: Props) => {
  const status = useFormStatus();
  const rawNominationId = status.data?.get('nominationId') as string | null;
  const formNominationId = rawNominationId
    ? parseInt(rawNominationId, 10)
    : null;
  const loading = formNominationId === nominationId && status.pending;

  return (
    <PredictionCheckbox selected={selected} loading={loading} state={state} />
  );
};
