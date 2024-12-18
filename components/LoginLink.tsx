import Link from 'next/link';
import { getPlayerByAuth0Id } from 'services/prisma/players';
import { auth0 } from 'lib/auth0';
import styles from './LoginLink.module.scss';

export const LoginLink: React.FC<{}> = async ({}) => {
  const session = await auth0.getSession();
  const auth0id = (session?.user?.sub as string) || null;

  const player = auth0id ? await getPlayerByAuth0Id(auth0id) : null;

  return (
    <div className={styles.login}>
      {player ? (
        <Link href={`/me`}>DASHBOARD</Link>
      ) : (
        <a href="/auth/login">LOGIN</a>
      )}
    </div>
  );
};
