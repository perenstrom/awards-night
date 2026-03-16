import { clsx } from 'clsx';

export const CardImage = (props: React.ComponentProps<'img'>) => {
  return (
    <img
      className={clsx(
        'bg-cover bg-no-repeat bg-center w-full object-cover h-[220px]',
        props.className
      )}
      {...props}
    />
  );
};
