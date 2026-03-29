import { FieldGroup } from '@/components/ui/field';
import { cn } from '@/lib/utils';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export const AdminFieldRow = ({ children, className }: Props) => {
  return (
    <FieldGroup className={cn('flex flex-row flex-wrap items-end gap-4', className)}>
      {children}
    </FieldGroup>
  );
};
