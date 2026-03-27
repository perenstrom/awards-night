export const LoadingSpinner = () => {
  return (
    <div
      className="inline-block h-10 w-10 box-border text-inherit [&::after]:box-border [&::after]:m-1 [&::after]:block [&::after]:h-[42px] [&::after]:w-8 [&::after]:rounded-full [&::after]:border-[3.2px] [&::after]:border-solid [&::after]:border-b-current [&::after]:border-l-transparent [&::after]:border-r-transparent [&::after]:border-t-current [&::after]:content-[''] [&::after]:animate-[spin_1.2s_linear_infinite]"
    />
  );
};
