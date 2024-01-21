import { Metadata } from 'next';
import { Typography } from '@mui/material';
import { MainContainer } from 'components/MainContainer';
import { withAdminRequiredAppRouter } from 'lib/authorization';

export const metadata: Metadata = {
  title: 'Admin dashboard – Awards Night'
};

export default withAdminRequiredAppRouter(
  async function Page() {
    return (
      <MainContainer>
        <Typography variant="h1">Admin panel</Typography>
        {/* <AddFilm /> */}
      </MainContainer>
    );
  },
  { returnTo: '/admin' }
);
