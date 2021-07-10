import { makeStyles, Container } from '@material-ui/core';
import { theme } from 'styles/theme';

const useStyles = makeStyles(() => ({
  main: { paddingTop: theme.spacing(8) }
}));

export const MainContainer: React.FC<{}> = (props) => {
  const { main } = useStyles(props);

  return (
    <Container maxWidth="md" className={main}>
      {props.children}
    </Container>
  );
};
