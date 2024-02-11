import { Metadata } from 'next';
import { Typography } from '@mui/material';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { withAdminRequiredAppRouter } from 'lib/authorization';
import { MainContainer } from 'components/MainContainer';
import { getNominationData } from 'lib/getNominationData';
import { setWinner } from 'app/admin/actions';
import { NominationList } from 'components/NominationList';

export const metadata: Metadata = {
  title: 'Admin dashboard – Awards Night'
};

export default withAdminRequiredAppRouter(
  async function Page({ params: rawParams }) {
    const params = z
      .object({
        year: z.string()
      })
      .safeParse(rawParams);

    if (params.success === false) redirect('/admin');
    const yearParam = params.data.year;

    const nominationData = await getNominationData(parseInt(yearParam, 10));
    if (!nominationData) redirect('/admin');
    const { year } = nominationData;

    return (
      <MainContainer>
        <Typography variant="h1">Admin page for {year.year}</Typography>
        <Suspense>
          <NominationList
            formAction={setWinner}
            nominationData={nominationData}
          />
        </Suspense>
      </MainContainer>
    );
  },
  { returnTo: '/admin' }
);
