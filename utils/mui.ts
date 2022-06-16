export const defaultStyledOptions = <T>(props: (keyof T)[]) => ({
  shouldForwardProp: (prop: keyof T) => !props.includes(prop)
});
