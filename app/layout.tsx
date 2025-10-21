import './global.scss';
import { Metadata } from 'next';
import { Auth0Provider } from '@auth0/nextjs-auth0';
import { Inter, Roboto, Charis_SIL } from 'next/font/google';
import { auth0 } from 'lib/auth0';

const title = 'Awards Night – Social prediction for the Academy Awards';
export const metadata: Metadata = {
  title: process.env.NODE_ENV !== 'production' ? `DEV: ${title}` : title
};

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '500', '700'],
  display: 'swap'
});
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap'
});
const charis_SIL = Charis_SIL({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap'
});

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth0.getSession();

  return (
    <html
      lang="en"
      className={`${inter.className} ${roboto.className} ${charis_SIL.className}`}
    >
      <head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
        />
        <meta charSet="utf-8" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#bba267" />
        <meta name="msapplication-TileColor" content="#bba267" />
        <meta name="theme-color" content="#bba267" />
      </head>
      <body>
        <Auth0Provider user={session?.user}>{children}</Auth0Provider>
      </body>
    </html>
  );
}
