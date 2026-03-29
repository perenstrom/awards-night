'use client';

import React, { RefObject, useEffect, useRef, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Field, FieldLabel } from '@/components/ui/field';
import { Alert } from 'components/base/Alert';
import { AdminSection } from 'components/admin/AdminSection';
import { AdminFieldRow } from 'components/admin/AdminFieldRow';
import { revalidateTag } from '../../app/admin/actions';

const FormContent: React.FC<{
  inputRef: RefObject<HTMLInputElement | null>;
}> = ({ inputRef }) => {
  const { pending } = useFormStatus();

  return (
    <>
      <AdminFieldRow>
        <Field className="min-w-48 max-w-md flex-1">
          <FieldLabel htmlFor="tag">Tag</FieldLabel>
          <Input ref={inputRef} id="tag" name="tag" />
        </Field>
        <Button
          name="action"
          value="revalidateTag"
          type="submit"
          disabled={pending}
        >
          Revalidate
        </Button>
        {pending && <Spinner className="size-8" />}
      </AdminFieldRow>
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
    <AdminSection title="Revalidate Tag">
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
    </AdminSection>
  );
};
