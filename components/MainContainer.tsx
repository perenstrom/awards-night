import { Container } from '@mui/material';

interface Props {
  topMargin?: number;
}

export const MainContainer: React.FC<Props> = ({ children, topMargin = 8 }) => {
  return (
    <Container maxWidth="md" sx={{ pt: topMargin }}>
      {children}
    </Container>
  );
};
