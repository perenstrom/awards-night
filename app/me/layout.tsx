import React from 'react';
import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';
import { getAllNominationData } from 'lib/getNominationData';
import { playerIdKey } from 'lib/authorization';
import { getBettingDataForPlayer } from 'lib/getBettingData';
import { YearCard } from 'components/dashboard/YearCard';
import styles from './me.module.scss';

const betsForYear = (
  bettingData: Awaited<ReturnType<typeof getBettingDataForPlayer>>,
  year: number
) => {
  const { bets, yearBets } = bettingData;

  return bets.filter((bet) => yearBets[year].includes(bet.id));
};

export default withPageAuthRequired(
  async function MeLayout({ children }: { children?: React.ReactNode }) {
    const session = await getSession();
    if (!session) redirect('/');

    const playerId = session.user[playerIdKey] as number;
    const nominationData = await getAllNominationData();
    if (!nominationData) redirect('/');

    const bettingData = await getBettingDataForPlayer(playerId, nominationData);

    return (
      <div className={styles.mainWrapper}>
        <div className={styles.yearListWrapper}>
          {nominationData?.map((nomData) => (
            <YearCard
              key={nomData.year.year}
              nominationData={nomData}
              bets={betsForYear(bettingData, nomData.year.year)}
            />
          ))}
        </div>
        {children}
      </div>
    );
  },
  { returnTo: '/me' }
);
