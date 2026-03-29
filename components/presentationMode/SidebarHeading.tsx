interface Props {
  children: React.ReactNode;
  size?: 'lg' | 'sm';
}

export const SidebarHeading = ({ children, size = 'sm' }: Props) => {
  if (size === 'lg') {
    return (
      <h2 className="m-0 pb-[0.2em] text-[1.7em] font-light text-text-primary">
        {children}
      </h2>
    );
  }

  return (
    <h2 className="mx-0 mb-[0.2em] mt-4 text-[1.2em] font-light text-text-primary">
      {children}
    </h2>
  );
};
