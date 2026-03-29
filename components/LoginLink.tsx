import Link from 'next/link';
import { getPlayerByAuth0Id } from 'services/prisma/players';
import { auth0 } from 'lib/auth0';

interface LoginLinkProps {
  className?: string;
  linkClassName?: string;
}

export const LoginLink = async ({
  className,
  linkClassName
}: LoginLinkProps = {}) => {
  const session = await auth0.getSession();
  const auth0id = (session?.user?.sub as string) || null;

  const player = auth0id ? await getPlayerByAuth0Id(auth0id) : null;

  const resolvedWrapperClass =
    className ?? 'self-end p-2 leading-none transition-opacity duration-300 ease-in';
  const resolvedLinkClass = linkClassName ?? 'text-text-primary/30 no-underline';

  return (
    <div className={resolvedWrapperClass}>
      {player ? (
        <Link href="/me" className={resolvedLinkClass}>
          DASHBOARD
        </Link>
      ) : (
        <a href="/auth/login" className={resolvedLinkClass}>
          LOGIN
        </a>
      )}
    </div>
  );
};
