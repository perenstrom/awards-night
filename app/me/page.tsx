import { Metadata } from 'next';
import { MainContainer } from 'components/MainContainer';
import { Typography } from 'components/base/Typography';
import { Button } from 'components/base/Button';

export const metadata: Metadata = {
  title: 'Dashboard – Awards Night'
};

export default async function Page() {
  return (
    <MainContainer>
      <div style={{ marginBottom: '2rem' }}>
        <Typography variant="h1" noMargin={true} color="white">
          Dashboard
        </Typography>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Button element="a" href="/me/bets">
          My Predictions
        </Button>

        <div style={{ marginTop: '2rem' }}>
          <Typography variant="h2" color="white">
            Group Memberships
          </Typography>
          <div style={{ marginTop: '0.5rem' }}>
            <Typography variant="body" color="white">
              Coming soon...
            </Typography>
          </div>
        </div>
      </div>
    </MainContainer>
  );
}
