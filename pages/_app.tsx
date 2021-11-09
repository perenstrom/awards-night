import React from 'react';
import { MutableSnapshot, RecoilRoot } from 'recoil';
import { useRouter } from 'next/router';
import { UserProvider } from '@auth0/nextjs-auth0';
import { CssBaseline, ThemeProvider } from '@mui/material';
import Head from 'next/head';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

import { theme } from 'styles/theme';
import {
  initializeRecoilState,
  route as categoryRoute
} from './[year]/[category]';

const clientSideEmotionCache = createCache({ key: 'css', prepend: true });

function MyApp({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache
}) {
  const router = useRouter();

  // Initialize recoil state based on route and pageProps
  const initializeState = ({ set }: MutableSnapshot) => {
    if (router.route === categoryRoute) {
      initializeRecoilState(set, pageProps);
    }
  };

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
        />
      </Head>
      <RecoilRoot initializeState={initializeState}>
        <UserProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Component {...pageProps} key={router.asPath} />
          </ThemeProvider>
        </UserProvider>
      </RecoilRoot>
    </CacheProvider>
  );
}

export default MyApp;
