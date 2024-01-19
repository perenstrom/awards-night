import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse
} from 'next';
import { ParsedUrlQuery } from 'querystring';

export const isAdminKey = `${process.env.AUTH0_METADATA_NAMESPACE}/is_admin`;
export const playerIdKey = `${process.env.AUTH0_METADATA_NAMESPACE}/player_id`;

export const withAdminRequired = <
  Q extends { [key: string]: any },
  P extends ParsedUrlQuery
>(params: {
  getServerSideProps: GetServerSideProps<Q, P>;
  returnTo?: string;
}) => {
  return withPageAuthRequired({
    returnTo: params.returnTo,
    getServerSideProps: async (auth0Context) => {
      const session = await getSession(auth0Context.req, auth0Context.res);
      const user = session?.user;

      if (user?.[isAdminKey]) {
        return await params.getServerSideProps(
          auth0Context as GetServerSidePropsContext<P>
        );
      } else {
        return {
          redirect: {
            destination: '/',
            permanent: false
          }
        };
      }
    }
  });
};

export const isAdmin = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession(req, res);
  const user = session?.user ?? null;
  return !!user?.[isAdminKey];
};

export const isAuthorized = async (
  req: NextApiRequest,
  res: NextApiResponse,
  playerId: number
) => {
  const session = await getSession(req, res);
  const user = session?.user ?? null;

  return user?.[playerIdKey] === playerId;
};
