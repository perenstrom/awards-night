import {
  getSession,
  UserProfile,
  withPageAuthRequired
} from '@auth0/nextjs-auth0';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse
} from 'next';
import { ParsedUrlQuery } from 'querystring';
import { PlayerId } from 'types/nominations';

export const isAdminKey = `${process.env.AUTH0_METADATA_NAMESPACE}/is_admin`;
export const airtableIdKey = `${process.env.AUTH0_METADATA_NAMESPACE}/airtable_id`;

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
      const session = getSession(auth0Context.req, auth0Context.res);
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

export const isAdmin = (req: NextApiRequest, res: NextApiResponse) => {
  const session = <{ user: UserProfile }>getSession(req, res);
  const user = session?.user ?? null;
  return !!user?.[isAdminKey];
};

export const isAuthorized = (
  req: NextApiRequest,
  res: NextApiResponse,
  playerId: PlayerId
) => {
  const session = <{ user: UserProfile }>getSession(req, res);
  const user = session?.user ?? null;
  return user?.[airtableIdKey] === playerId;
};

export const getUserFromRequest = (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const session = <{ user: UserProfile }>getSession(req, res);
  const user = session?.user ?? null;

  return user;
};
