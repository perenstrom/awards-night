/* import {
  AppRouterPageRoute,
  WithPageAuthRequiredAppRouterOptions,
  getSession,
  withPageAuthRequired
} from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';
import { redirect } from 'next/navigation';*/

import { auth0 } from './auth0';

export const isAdminKey = `${process.env.AUTH0_METADATA_NAMESPACE}/is_admin`;
export const playerIdKey = `${process.env.AUTH0_METADATA_NAMESPACE}/player_id`;

export const isAdmin = async () => {
  const session = await auth0.getSession();
  const user = session?.user ?? null;
  return !!user?.[isAdminKey];
};
/*
export const withAdminRequiredAppRouter = (
  page: AppRouterPageRoute,
  opts?: WithPageAuthRequiredAppRouterOptions
) => {
  if (!isAdmin) return redirect('/');

  return withPageAuthRequired(page, opts);
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
