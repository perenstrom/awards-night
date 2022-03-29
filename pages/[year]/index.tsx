import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { getYears } from 'services/airtable';

interface Props {
  year: string;
}

const YearPage: NextPage<Props> = ({ year }) => {
  return <div>{year}</div>;
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

  return {
    props: {
      year
    }
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const years = await getYears();
  const paths = years.map((year) => ({
    params: { year: year.year.toString() }
  }));

  return {
    paths: paths,
    fallback: false
  };
};

export default YearPage;
