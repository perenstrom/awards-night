import { auth0 } from 'lib/auth0';
import { getPlayerByAuth0Id } from 'services/prisma/players';

export const GetStartedButton = async () => {
  const session = await auth0.getSession();
  const auth0id = (session?.user?.sub as string) || null;
  const player = auth0id ? await getPlayerByAuth0Id(auth0id) : null;
  const href = player ? '/me' : '/auth/login';

  return (
    <a
      href={href}
      className="font-bebas-neue text-[16px] lg:text-[17px] tracking-[0.15em] bg-gold text-[#0D0D0D] px-8 lg:px-10 py-3.5 inline-block no-underline"
    >
      GET STARTED
    </a>
  );
};
