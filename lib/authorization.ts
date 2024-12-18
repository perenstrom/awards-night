/* import {
  AppRouterPageRoute,
  WithPageAuthRequiredAppRouterOptions,
  getSession,
  withPageAuthRequired
} from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';
import { redirect } from 'next/navigation';*/

export const isAdminKey = `${process.env.AUTH0_METADATA_NAMESPACE}/is_admin`;
export const playerIdKey = `${process.env.AUTH0_METADATA_NAMESPACE}/player_id`;

/*
export const withAdminRequiredAppRouter = (
  page: AppRouterPageRoute,
  opts?: WithPageAuthRequiredAppRouterOptions
) => {
  if (!isAdmin) return redirect('/');

  return withPageAuthRequired(page, opts);
};

export const isAdmin = async () => {
  const session = await getSession();
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
 */
