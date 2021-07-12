import React, { useEffect } from 'react';
import { RecoilRoot } from 'recoil';
import { useRouter } from 'next/router';
import { UserProvider } from '@auth0/nextjs-auth0';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { theme } from 'styles/theme';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
        />
      </Head>
      <RecoilRoot>
        <UserProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Component {...pageProps} key={router.asPath} />
          </ThemeProvider>
        </UserProvider>
      </RecoilRoot>
    </>
  );
}

export default MyApp;
