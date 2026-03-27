type Props =
  | React.InputHTMLAttributes<HTMLInputElement> & {
      inputRef?: React.RefObject<HTMLInputElement | null>;
      label: string;
    };

export const InputField = (props: Props) => {
  const { inputRef, label, id, ...args } = props;

  return (
    <div className="flex flex-col gap-[0.2rem]">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        className="h-10 rounded border border-solid border-background-grey-1"
        {...args}
        ref={inputRef}
      />
    </div>
  );
};
