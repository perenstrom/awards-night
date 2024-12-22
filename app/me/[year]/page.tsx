import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { getNominationData } from 'lib/getNominationData';
import { MainContainer } from 'components/MainContainer';
import { getLoggedInPlayer } from 'lib/player';
import { NominationList } from 'components/NominationList';
import { getBetsForPlayer } from 'services/prisma/bets';
import { Typography } from 'components/base/Typography';
import { Button } from 'components/base/Button';
import { setBet } from '../actions';
import styles from './meYear.module.scss';

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

  const bets = await getBetsForPlayer(player.id, year.year);

  return (
    <MainContainer>
      <div className={styles.header}>
        <Typography variant="h1" noMargin={true}>
          {year.bettingOpen
            ? `${year.year} predictions`
            : `${year.year} results`}
        </Typography>
        <div className={styles.buttonWrapper}>
          <div className={styles.backLink}>
            <Button element="a" href="/me">
              &lt; Dashboard
            </Button>
          </div>
          <Button
            element="a"
            href={`/${year.year}/${Object.values(categories)[0].slug}`}
          >
            Go to presentation mode &gt;
          </Button>
        </div>
      </div>
      <NominationList
        formAction={setBet}
        nominationData={nominationData}
        playerBets={bets}
      />
    </MainContainer>
  );
}
