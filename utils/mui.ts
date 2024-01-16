export const defaultStyledOptions = (props: string[]) => ({
  shouldForwardProp: (prop: string) => !props.includes(prop)
});
