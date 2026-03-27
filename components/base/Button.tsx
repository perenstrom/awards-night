import Link, { LinkProps } from 'next/link';

type Props =
  | (React.ButtonHTMLAttributes<HTMLButtonElement> & {
      element?: 'button';
    })
  | (LinkProps & {
      children: React.ReactNode;
      element: 'a';
    });

export const Button = (props: Props) => {
  const wrapperClassName =
    'h-10 rounded border-0 bg-text-primary p-0 shadow-[var(--shadow-elevation-medium)]';
  const buttonClassName =
    'block h-full w-full cursor-pointer border-0 bg-transparent px-4 py-2 text-black no-underline max-md:px-2 max-md:py-[0.2rem] max-md:text-[0.9rem]';

  if (props.element === 'a') {
    return (
      <div className={wrapperClassName}>
        <Link className={buttonClassName} {...props} />
      </div>
    );
  } else {
    return (
      <div className={wrapperClassName}>
        <button className={buttonClassName} {...props} />
      </div>
    );
  }
};
