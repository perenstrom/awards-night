import { Metadata } from 'next';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { MainContainer } from 'components/MainContainer';
import { getNominationData } from 'lib/getNominationData';
import { closeYear, setWinner } from 'app/admin/actions';
import { NominationList } from 'components/NominationList';
import { isAdmin } from 'lib/authorization';
import { Typography } from 'components/base/Typography';
import { Button } from 'components/base/Button';
import styles from './year.module.scss';

export const metadata: Metadata = {
  title: 'Admin dashboard – Awards Night'
};

interface Props {
  params: Promise<{ year: string; category: string }>;
}
export default async function Page(props: Props) {
  const admin = await isAdmin();
  if (!admin) return redirect('/');

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
  const { year } = nominationData;

  return (
    <MainContainer>
      <Typography variant="h1" color="white">
        Admin page for {year.year}
      </Typography>
      {!year.awardsFinished && (
        <form action={closeYear} className={styles.closeWrapper}>
          <input type="hidden" name="year" value={year.year} />
          <Button type="submit">Close year</Button>
        </form>
      )}
      <NominationList
        formAction={setWinner}
        nominationData={nominationData}
        actionDisabled={year.bettingOpen || year.awardsFinished}
      />
    </MainContainer>
  );
}
