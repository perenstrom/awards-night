import { clsx } from 'clsx';

export const GridItem = ({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={clsx(
        'min-w-[200px] max-w-[270px] flex-grow hyphens-auto break-words basis-[calc(100%/3)] rounded-sm overflow-hidden shadow-md',
        className
      )}
    >
      {children}
    </div>
  );
};
