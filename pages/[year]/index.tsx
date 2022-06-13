import { Typography } from '@mui/material';
import { MainContainer } from 'components/MainContainer';
import { getNominationData } from 'lib/getNominationData';
import { prismaContext } from 'lib/prisma';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { ParsedUrlQuery } from 'querystring';
import { getYears } from 'services/prisma';
import { NominationData } from 'types/nominations';
import { RequiredBy } from 'types/utilityTypes';

interface Props {
  year: string;
  nominationData: NominationData;
}

const YearPage: NextPage<Props> = ({ year, nominationData }) => {
  return (
    <div>
      <Head>
        <title>Nominations for {year}</title>
      </Head>
      <MainContainer>
        <Typography variant="h1">Nominations for {year}</Typography>
        <ul>
          {Object.values(nominationData.categories).map((category) => (
            <li key={category.slug}>
              <Link href={`/${year}/${category.slug}`}>
                <a>{category.name}</a>
              </Link>
            </li>
          ))}
        </ul>
      </MainContainer>
    </div>
  );
};

interface Params extends ParsedUrlQuery {
  year: string;
}
export const getStaticProps: GetStaticProps<Props, Params> = async (
  context
) => {
  if (!context.params?.year) {
    throw new Error('Page called without year param');
  }

  const year = context.params.year;

  const nominationData = await getNominationData(
    parseInt((context as RequiredBy<typeof context, 'params'>).params.year, 10),
    prismaContext
  );
  if (!nominationData) {
    throw new Error('Error when fetching nomination data');
  }

  return {
    props: {
      year,
      nominationData
    }
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const years = await getYears(prismaContext);
  const paths = years.map((year) => ({
    params: { year: year.year.toString() }
  }));

  return {
    paths: paths,
    fallback: false
  };
};

export default YearPage;
