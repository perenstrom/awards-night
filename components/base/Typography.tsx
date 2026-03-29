import { clsx } from 'clsx';

interface Props {
  children: React.ReactNode;
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body';
  color?: 'white' | 'black';
  noMargin?: boolean;
}

const variantClasses: Record<Props['variant'], string> = {
  h1: 'text-h1 max-md:text-h1-mobile',
  h2: 'text-h2 max-md:text-h2-mobile',
  h3: 'text-h3 max-md:text-h3-mobile',
  h4: 'text-h4 max-md:text-h4-mobile',
  h5: 'text-h5 max-md:text-h5-mobile',
  h6: 'text-h6 max-md:text-h6-mobile',
  body: 'text-base'
};

const getClassNames = (
  variant: Props['variant'],
  noMargin: boolean,
  color: Props['color'] = 'black'
) =>
  clsx(
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
