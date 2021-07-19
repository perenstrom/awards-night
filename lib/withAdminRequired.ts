import {
  getSession,
  UserProfile,
  withPageAuthRequired
} from '@auth0/nextjs-auth0';
import { GetServerSideProps, NextApiRequest, NextApiResponse } from 'next';
import { PlayerId } from 'types/nominations';

export const isAdminKey = `${process.env.AUTH0_METADATA_NAMESPACE}/is_admin`;
export const airtableIdKey = `${process.env.AUTH0_METADATA_NAMESPACE}/airtable_id`;

export const withAdminRequired = (params: {
  getServerSideProps: GetServerSideProps;
  returnTo?: string;
}) => {
  return withPageAuthRequired({
    returnTo: params.returnTo,
    getServerSideProps: async (auth0Context) => {
      const { user } = getSession(auth0Context.req, auth0Context.res);

      if (user[isAdminKey]) {
        return await params.getServerSideProps(auth0Context);
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
