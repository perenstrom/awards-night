import Link from 'next/link';
import { getPlayerByAuth0Id } from 'services/prisma/players';
import { auth0 } from 'lib/auth0';

export const LoginLink = async () => {
  const session = await auth0.getSession();
  const auth0id = (session?.user?.sub as string) || null;

  const player = auth0id ? await getPlayerByAuth0Id(auth0id) : null;

  return (
    <div className="self-end p-2 leading-none transition-opacity duration-300 ease-in">
      {player ? (
        <Link
          href="/me"
          className="text-white/30 no-underline"
        >
          DASHBOARD
        </Link>
      ) : (
        <a
          href="/auth/login"
          className="text-white/30 no-underline"
        >
          LOGIN
        </a>
      )}
    </div>
  );
};
