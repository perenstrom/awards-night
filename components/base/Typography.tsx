import { clsx } from 'clsx';

interface Props {
  children: React.ReactNode;
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body';
  color?: 'white' | 'black';
  noMargin?: boolean;
}

const variantClasses: Record<Props['variant'], string> = {
  h1: 'text-[2.986rem] max-md:text-[1.476rem]',
  h2: 'text-[2.488rem] max-md:text-[1.383rem]',
  h3: 'text-[2.074rem] max-md:text-[1.296rem]',
  h4: 'text-[1.728rem] max-md:text-[1.215rem]',
  h5: 'text-[1.44rem] max-md:text-[1.138rem]',
  h6: 'text-[1.2rem] max-md:text-[1.067rem]',
  body: 'text-base'
};

const getClassNames = (
  variant: Props['variant'],
  noMargin: boolean,
  color: Props['color'] = 'black'
) =>
  clsx(
    'font-[Inter,sans-serif]',
    variant === 'body' ? 'leading-[1.6]' : 'leading-[1.2]',
    variantClasses[variant],
    !noMargin && 'mb-5',
    color === 'white' ? 'text-text-primary' : 'text-black'
  );

export const Typography = (props: Props) => {
  const { children, variant, noMargin = false, color = 'black' } = props;

  switch (variant) {
    case 'h1':
      return (
        <h1 className={getClassNames(variant, noMargin, color)}>{children}</h1>
      );
    case 'h2':
      return (
        <h2 className={getClassNames(variant, noMargin, color)}>{children}</h2>
      );
    case 'h3':
      return (
        <h3 className={getClassNames(variant, noMargin, color)}>{children}</h3>
      );
    case 'h4':
      return (
        <h4 className={getClassNames(variant, noMargin, color)}>{children}</h4>
      );
    case 'h5':
      return (
        <h5 className={getClassNames(variant, noMargin, color)}>{children}</h5>
      );
    case 'h6':
      return (
        <h6 className={getClassNames(variant, noMargin, color)}>{children}</h6>
      );

    default:
      return (
        <p className={getClassNames('body', noMargin, color)}>{children}</p>
      );
  }
};
