export const defaultStyledOptions = <T>(props: (keyof T)[]) => ({
  shouldForwardProp: (prop) => !props.includes(prop)
});
