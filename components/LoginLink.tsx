import Link from 'next/link';
import { getSession } from '@auth0/nextjs-auth0';
import { getPlayerByAuth0Id } from 'services/prisma/players';
import styles from './LoginLink.module.scss';

export const LoginLink: React.FC<{}> = async ({}) => {
  const session = await getSession();
  const auth0id = (session?.user?.sub as string) || null;

  const player = auth0id ? await getPlayerByAuth0Id(auth0id) : null;

  return (
    <div className={styles.login}>
      <Link href={`/me`}>{player ? 'DASHBOARD' : 'LOG IN'}</Link>
    </div>
  );
};
