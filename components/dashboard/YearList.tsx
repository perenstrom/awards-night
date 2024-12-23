import React from 'react';
import { redirect } from 'next/navigation';
import { getAllNominationData } from 'lib/getNominationData';
import { playerIdKey } from 'lib/authorization';
import { getBettingDataForPlayer } from 'lib/getBettingData';
import { YearCard } from 'components/dashboard/YearCard';
import { auth0 } from 'lib/auth0';
import YearListWrapper from './YearListWrapper';
import styles from './YearList.module.scss';

const betsForYear = (
  bettingData: Awaited<ReturnType<typeof getBettingDataForPlayer>>,
  year: number
) => {
  const { bets, yearBets } = bettingData;

  return bets.filter((bet) => yearBets[year].includes(bet.id));
};

export default async function YearList() {
  const session = await auth0.getSession();
  if (!session) redirect('/');

  const playerId = session.user[playerIdKey] as number;
  const nominationData = await getAllNominationData();
  if (!nominationData) redirect('/');

  const bettingData = await getBettingDataForPlayer(playerId, nominationData);

  return (
    <YearListWrapper>
      <div className={styles.stickyWrapper}>
        {nominationData?.map((nomData) => (
          <YearCard
            key={nomData.year.year}
            nominationData={nomData}
            bets={betsForYear(bettingData, nomData.year.year)}
          />
        ))}
      </div>
    </YearListWrapper>
  );
}
