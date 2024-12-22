import { auth0 } from './auth0';

export const isAdminKey = `${process.env.AUTH0_METADATA_NAMESPACE}/is_admin`;
export const playerIdKey = `${process.env.AUTH0_METADATA_NAMESPACE}/player_id`;

export const isAdmin = async () => {
  const session = await auth0.getSession();
  const user = session?.user ?? null;
  return !!user?.[isAdminKey];
};
