import { clsx } from 'clsx';

export const Container = ({
  children,
  className,
  noPaddingTop = false
}: {
  children: React.ReactNode;
  className?: string;
  noPaddingTop?: boolean;
}) => {
  return (
    <div
      className={clsx(
        'max-w-[900px] w-full mx-auto px-4 box-border',
        !noPaddingTop && 'pt-4',
        className
      )}
    >
      {children}
    </div>
  );
};
