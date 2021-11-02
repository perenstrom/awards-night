import React, { useEffect } from 'react';
import { MutableSnapshot, RecoilRoot } from 'recoil';
import { useRouter } from 'next/router';
import { UserProvider } from '@auth0/nextjs-auth0';
import {
  CssBaseline,
  ThemeProvider,
  StyledEngineProvider
} from '@mui/material';
import { theme } from 'styles/theme';
import Head from 'next/head';
import {
  initializeRecoilState,
  route as categoryRoute
} from './[year]/[category]';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // Initialize recoil state based on route and pageProps
  const initializeState = ({ set }: MutableSnapshot) => {
    if (router.route === categoryRoute) {
      initializeRecoilState(set, pageProps);
    }
  };

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
      <RecoilRoot initializeState={initializeState}>
        <UserProvider>
          <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Component {...pageProps} key={router.asPath} />
            </ThemeProvider>
          </StyledEngineProvider>
        </UserProvider>
      </RecoilRoot>
    </>
  );
}

export default MyApp;
