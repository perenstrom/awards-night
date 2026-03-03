import { clsx } from 'clsx';

export const GridWrapper = ({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={clsx('flex gap-4 flex-none flex-wrap justify-center', className)}
    >
      {children}
    </div>
  );
};
