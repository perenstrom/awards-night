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
      <div className="mb-8">
        <Typography variant="h1" noMargin={true} color="white">
          Dashboard
        </Typography>
      </div>
      <div className="flex flex-col gap-4">
        <Button element="a" href="/me/bets">
          My Predictions
        </Button>

        <div className="mt-8">
          <Typography variant="h2" color="white">
            Group Memberships
          </Typography>
          <div className="mt-2">
            <Typography variant="body" color="white">
              Coming soon...
            </Typography>
          </div>
        </div>
      </div>
    </MainContainer>
  );
}
