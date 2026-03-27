import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { getNominationData } from 'lib/getNominationData';
import { MainContainer } from 'components/MainContainer';
import { getLoggedInPlayer } from 'lib/player';
import { NominationList } from 'components/NominationList';
import { getBetsForPlayerCached } from 'services/prisma/bets';
import { Typography } from 'components/base/Typography';
import { Button } from '@/components/ui/button';
import { setBet } from '../actions';

export const metadata: Metadata = {
  title: 'My predictions – Awards Night'
};

interface Props {
  params: Promise<{ year: string }>;
}

export default async function Page(props: Props) {
  const rawParams = await props.params;
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

  const bets = await getBetsForPlayerCached(player.id, year.year);

  // Go to presentation mode without group slug - let the presentation mode handle group selection
  const presentationUrl = `/${year.year}/${Object.values(categories)[0].slug}`;

  return (
    <MainContainer>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <Typography variant="h1" noMargin={true} color="white">
          {year.bettingOpen
            ? `${year.year} predictions`
            : `${year.year} results`}
        </Typography>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="md:hidden">
            <Button asChild>
              <Link href="/me/bets">&lt; My Bets</Link>
            </Button>
          </div>
          <Button asChild>
            <Link href={presentationUrl}>Go to presentation mode &gt;</Link>
          </Button>
        </div>
      </div>
      <NominationList
        formAction={setBet}
        nominationData={nominationData}
        playerBets={bets}
        actionDisabled={!year.bettingOpen}
      />
    </MainContainer>
  );
}
