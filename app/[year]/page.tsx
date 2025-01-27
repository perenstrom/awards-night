import { Metadata } from 'next';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { MainContainer } from 'components/MainContainer';
import { getNominationData } from 'lib/getNominationData';
import { Typography } from 'components/base/Typography';
import styles from './year.module.scss';

type Props = {
  params: Promise<{ year: number }>;
};
export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  return {
    title: `Nominations for ${params.year}`
  };
}

export default async function Page(props: Props) {
  const rawParams = await props.params;
  const params = z
    .object({
      year: z.string()
    })
    .safeParse(rawParams);

  if (params.success === false) redirect('/');
  const yearParam = params.data.year;

  const nominationData = await getNominationData(parseInt(yearParam, 10));
  if (!nominationData) redirect('/');
  const { year } = nominationData;

  return (
    <MainContainer>
      <Typography variant="h1" color="white">
        Nominations for {year.year}
      </Typography>
      <ul className={styles.list}>
        {Object.values(nominationData.categories).map((category) => (
          <li key={category.slug}>
            <Link href={`/${year.year}/${category.slug}`}>{category.name}</Link>
          </li>
        ))}
      </ul>
    </MainContainer>
  );
}
