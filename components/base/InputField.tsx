import styles from './InputField.module.scss';

type Props =
  | React.InputHTMLAttributes<HTMLInputElement> & {
      inputRef?: React.RefObject<HTMLInputElement | null>;
      label: string;
    };

export const InputField = (props: Props) => {
  const { inputRef, label, id, ...args } = props;

  return (
    <div className={styles.inputWrapper}>
      <label htmlFor={id}>{label}</label>
      <input id={id} className={styles.inputText} {...args} ref={inputRef} />
    </div>
  );
};
