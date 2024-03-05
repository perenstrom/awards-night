import { clsx } from 'clsx';
import styles from './Typography.module.scss';

interface Props {
  children: React.ReactNode;
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body';
  noMargin?: boolean;
}

export const Typography = (props: Props) => {
  const { children, variant, noMargin = false } = props;

  switch (variant) {
    case 'h1':
      return (
        <h1
          className={clsx(styles.base, styles.h1, {
            [styles.margin]: !noMargin
          })}
        >
          {children}
        </h1>
      );
    case 'h2':
      return (
        <h2
          className={clsx(styles.base, styles.h2, {
            [styles.margin]: !noMargin
          })}
        >
          {children}
        </h2>
      );
    case 'h3':
      return (
        <h3
          className={clsx(styles.base, styles.h3, {
            [styles.margin]: !noMargin
          })}
        >
          {children}
        </h3>
      );
    case 'h4':
      return (
        <h4
          className={clsx(styles.base, styles.h4, {
            [styles.margin]: !noMargin
          })}
        >
          {children}
        </h4>
      );
    case 'h5':
      return (
        <h5
          className={clsx(styles.base, styles.h5, {
            [styles.margin]: !noMargin
          })}
        >
          {children}
        </h5>
      );
    case 'h6':
      return (
        <h6
          className={clsx(styles.base, styles.h6, {
            [styles.margin]: !noMargin
          })}
        >
          {children}
        </h6>
      );

    default:
      return (
        <p
          className={clsx(styles.base, styles.body, {
            [styles.margin]: !noMargin
          })}
        >
          {children}
        </p>
      );
  }
};
