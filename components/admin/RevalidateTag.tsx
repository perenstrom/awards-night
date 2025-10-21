'use client';

import React, { RefObject, useEffect, useRef, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from 'components/base/Button';
import { InputField } from 'components/base/InputField';
import { LoadingSpinner } from 'components/base/LoadingSpinner';
import { Typography } from 'components/base/Typography';
import { Alert } from 'components/base/Alert';
import { revalidateTag } from '../../app/admin/actions';

const FormContent: React.FC<{
  inputRef: RefObject<HTMLInputElement | null>;
}> = ({ inputRef }) => {
  const { pending } = useFormStatus();

  return (
    <>
      <div className="flex items-end gap-4">
        <InputField id="tag" inputRef={inputRef} name="tag" label="Tag" />
        <Button
          name="action"
          value="revalidateTag"
          color="primary"
          type="submit"
          disabled={pending}
        >
          Revalidate
        </Button>
        {pending && <LoadingSpinner />}
      </div>
    </>
  );
};

export const RevalidateTag = () => {
  const [statusMessage, revalidateTagAction] = useActionState(
    revalidateTag,
    null
  );
  const tagInputElement = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (statusMessage?.severity !== 'error' && tagInputElement.current) {
      tagInputElement.current.value = '';
      tagInputElement.current.focus();
    }
  }, [statusMessage]);

  return (
    <div className="mt-4 p-4 rounded-md bg-white">
      <Typography variant="h2">Revalidate Tag</Typography>
      <div className="mt-4">
        <form action={revalidateTagAction}>
          <FormContent inputRef={tagInputElement} />
        </form>
        {statusMessage && (
          <div className="mt-4">
            <Alert
              severity={statusMessage.severity}
              message={statusMessage.message}
            />
          </div>
        )}
      </div>
    </div>
  );
};
