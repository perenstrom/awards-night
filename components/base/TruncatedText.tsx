interface Props {
  children: React.ReactNode;
}

export const TruncatedText = ({ children }: Props) => {
  return (
    <div className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis px-1.5 -mx-1.5">
      {children}
    </div>
  );
};
