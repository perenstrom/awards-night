import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { Typography } from '@mui/material';
import Link from 'next/link';
import { getNominationData } from 'lib/getNominationData';
import { MainContainer } from 'components/MainContainer';
import { getLoggedInPlayer } from 'lib/player';
import { NominationList } from 'components/NominationList';
import { getBetsForPlayer } from 'services/prisma/bets';
import { setBet } from '../actions';

export const metadata: Metadata = {
  title: 'My predictions – Awards Night'
};

export default withPageAuthRequired(
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

    const player = await getLoggedInPlayer();
    if (!player) redirect('/');

    const { year, categories } = nominationData;

    const bets = await getBetsForPlayer(player.id, year.year);

    return (
      <MainContainer>
        <Link href={'/me'}>&lt; Dashboard</Link>
        <span> | </span>
        <Link href={`/${year.year}/${Object.values(categories)[0].slug}`}>
          Go to presentation mode &gt;
        </Link>
        <Typography variant="h1">{`Betting for ${player.name}`}</Typography>
        {!year.bettingOpen && <p>Betting is closed</p>}
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
