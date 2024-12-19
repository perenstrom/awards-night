import { clsx } from 'clsx';
import styles from './Typography.module.scss';

interface Props {
  children: React.ReactNode;
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body';
  color?: 'white' | 'black';
  noMargin?: boolean;
}

const getClassNames = (
  variant: Props['variant'],
  noMargin: boolean,
  color: Props['color'] = 'black'
) =>
  clsx(
    styles.base,
    styles[variant],
    { [styles.margin]: !noMargin },
    styles[color]
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
