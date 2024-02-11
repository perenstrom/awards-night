import { Typography } from '@mui/material';
import { Metadata } from 'next';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { MainContainer } from 'components/MainContainer';
import { getNominationData } from 'lib/getNominationData';

type Props = {
  params: { year: number };
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Nominations for ${params.year}`
  };
}

export default async function Page({ params: rawParams }: Props) {
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
      <Typography variant="h1">Nominations for {year.year}</Typography>
      <ul>
        {Object.values(nominationData.categories).map((category) => (
          <li key={category.slug}>
            <Link href={`/${year.year}/${category.slug}`}>{category.name}</Link>
          </li>
        ))}
      </ul>
    </MainContainer>
  );
}
