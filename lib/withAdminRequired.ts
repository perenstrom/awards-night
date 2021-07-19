import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { GetServerSideProps, NextApiRequest, NextApiResponse } from 'next';

export const isAdminKey = `${process.env.AUTH0_METADATA_NAMESPACE}/is_admin`;

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
  const session = getSession(req, res);
  const user = session?.user ?? null;
  return !!user?.[isAdminKey];
};
