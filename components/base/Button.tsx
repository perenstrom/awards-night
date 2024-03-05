import Link, { LinkProps } from 'next/link';
import styles from './Button.module.scss';

type Props =
  | (React.ButtonHTMLAttributes<HTMLButtonElement> & {
      element?: 'button';
    })
  | (LinkProps & {
      children: React.ReactNode;
      element: 'a';
    });

export const Button = (props: Props) => {
  if (props.element === 'a') {
    return (
      <div className={styles.wrapper}>
        <Link className={styles.button} {...props} />
      </div>
    );
  } else {
    return (
      <div className={styles.wrapper}>
        <button className={styles.button} {...props} />
      </div>
    );
  }
};
