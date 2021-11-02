import { Container } from '@mui/material';

export const MainContainer: React.FC<{}> = (props) => {
  return (
    <Container maxWidth="md" sx={{ pt: 8 }}>
      {props.children}
    </Container>
  );
};
