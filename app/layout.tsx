import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import './global.scss';
import { Metadata } from 'next';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { Auth0Provider } from '@auth0/nextjs-auth0';
import { theme } from 'styles/theme';
import { auth0 } from 'lib/auth0';

export const metadata: Metadata = {
  title: 'Awards Night – Social prediction for the Academy Awards'
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth0.getSession();

  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
        />
        <meta charSet="utf-8" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Charis+SIL:ital@0;1&display=swap"
          rel="stylesheet"
        />
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
        <Auth0Provider user={session?.user}>
          <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              {children}
            </ThemeProvider>
          </AppRouterCacheProvider>
        </Auth0Provider>
      </body>
    </html>
  );
}
