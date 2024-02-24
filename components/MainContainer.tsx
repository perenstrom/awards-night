import { Container } from '@mui/material';

interface Props {
  children: React.ReactNode;
  topMargin?: number;
}

export const MainContainer = ({ children, topMargin = 8 }: Props) => {
  return (
    <Container maxWidth="md" sx={{ pt: topMargin, background: 'white' }}>
      {children}
    </Container>
  );
};
