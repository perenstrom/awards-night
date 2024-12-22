import styles from './InputField.module.scss';

type Props =
  | React.InputHTMLAttributes<HTMLInputElement> & {
      inputRef?: React.RefObject<HTMLInputElement | null>;
    };

export const InputField = (props: Props) => {
  const { inputRef, id, ...args } = props;

  return (
    <div className={styles.inputWrapper}>
      <label htmlFor={id}>IMDb ID</label>
      <input id={id} className={styles.inputText} {...args} ref={inputRef} />
    </div>
  );
};
