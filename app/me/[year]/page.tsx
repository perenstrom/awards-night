import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import Link from 'next/link';
import { getNominationData } from 'lib/getNominationData';
import { MainContainer } from 'components/MainContainer';
import { getLoggedInPlayer } from 'lib/player';
import { NominationList } from 'components/NominationList';
import { getBetsForPlayer } from 'services/prisma/bets';
import { Typography } from 'components/base/Typography';
import { setBet } from '../actions';
import styles from './meYear.module.scss';

export const metadata: Metadata = {
  title: 'My predictions – Awards Night'
};

export default withPageAuthRequired(
  async function Page({ params: rawParams }) {
    console.log('rendering');
    const params = z
      .object({
        year: z.string()
      })
      .safeParse(rawParams);

    if (params.success === false) redirect('/admin');
    const yearParam = params.data.year;

    const nominationData = await getNominationData(parseInt(yearParam, 10));
    if (!nominationData) redirect('/admin');

    const player = await getLoggedInPlayer();
    if (!player) redirect('/');

    const { year, categories } = nominationData;

    console.log('getting bets');
    const bets = await getBetsForPlayer(player.id, year.year);
    console.log('got bets');
    console.log(JSON.stringify(bets, null, 2));

    return (
      <MainContainer>
        <div className={styles.backLink}>
          <Link href={'/me'}>&lt; Dashboard</Link>
          <span> | </span>
        </div>
        <Link href={`/${year.year}/${Object.values(categories)[0].slug}`}>
          Go to presentation mode &gt;
        </Link>
        <Typography variant="h1">
          {year.bettingOpen
            ? `${year.year} predictions`
            : `${year.year} results`}
        </Typography>
        <NominationList
          formAction={setBet}
          nominationData={nominationData}
          playerBets={bets}
        />
      </MainContainer>
    );
  },
  { returnTo: '/me' }
);
