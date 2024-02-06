import { Metadata } from 'next';
import { Typography } from '@mui/material';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { withAdminRequiredAppRouter } from 'lib/authorization';
import { MainContainer } from 'components/MainContainer';
import { BetItem } from 'components/BetItem';
import { getNominationData } from 'lib/getNominationData';
import { Category } from 'types/nominations';
import { setWinner } from 'components/admin/actions';

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
    const { year, categories, nominations, films } = nominationData;

    return (
      <MainContainer>
        <Typography variant="h1">Admin page for {year.year}</Typography>
        <Suspense>
          <form action={setWinner}>
            <input type="hidden" name="year" value={year.year} />
            {(Object.values(categories) as Category[]).map((category) => (
              <div key={category.slug}>
                <Typography variant="h2">{category.name}</Typography>
                <ul className="p-0">
                  {category.nominations.map((nominationId) => {
                    const nomination = nominations[nominationId];

                    return (
                      <BetItem
                        key={nomination.id}
                        nominationId={nomination.id}
                        won={nomination.won}
                        decided={nomination.decided}
                        filmName={films[nomination.film].name}
                        poster={films[nomination.film].poster}
                        nominee={nomination.nominee}
                      />
                    );
                  })}
                </ul>
              </div>
            ))}
          </form>
        </Suspense>
      </MainContainer>
    );
  },
  { returnTo: '/admin' }
);
