import React from 'react';
import { createGlobalStyle } from 'styled-components';
import { useRouter } from 'next/router';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  
  body {
    margin: 0;
    padding: 0;
    font-family: Futura, Helvetica, Arial, sans-serif;
  }

  p {
    margin: 0;
  }
`;

function MyApp({ Component, pageProps }) {
  return (
    <>
      <GlobalStyle />
      <Component {...pageProps} key={router.asPath}/>
    </>
  );
}

export default MyApp;
