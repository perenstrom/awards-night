import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { MainContainer } from 'components/MainContainer';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  styled,
  Typography
} from '@mui/material';
import { Player } from 'types/nominations';
import { getLoggedInPlayer } from 'services/local';
import { defaultStyledOptions } from 'utils/mui';

interface Props {}

const MainWrapper = styled('div')`
  flex-grow: 1;
  display: flex;
  align-items: center;
`;

const HeroWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 20rem;
  background-color: black;
  background-image: url('/images/hero.jpg');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
`;

interface LoginProps {
  readonly ready: boolean;
}
const Login = styled(
  'div',
  defaultStyledOptions<LoginProps>(['ready'])
)<LoginProps>`
  opacity: ${({ ready }) => (ready ? '1' : '0')};
  align-self: flex-end;
  padding: 0.5rem;
  line-height: 1;

  transition: opacity 0.3s ease-in;

  a {
    color: rgba(255, 255, 255, 0.3);
    text-decoration: none;
  }
`;

const TitleShadow = styled('span')`
  text-shadow: 0 0 3rem #000000;
`;

type State = 'idle' | 'loading';
const FrontPage: NextPage<Props> = () => {
  const [player, setPlayer] = useState<Player>();
  const [state, setState] = useState<State>('loading');

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const player = await getLoggedInPlayer();
        setPlayer(player);
      } catch (_) {}
      setState('idle');
    };
    fetchDataAsync();
  }, []);

  return (
    <div>
      <Head>
        <title>Oscar Night – Social prediction for the Academy Awards</title>
      </Head>
      <HeroWrapper>
        <Login ready={state === 'idle'}>
          <Link href={`/me`}>
            <a>{player ? 'DASHBOARD' : 'LOG IN'}</a>
          </Link>
        </Login>
        <MainWrapper>
          <MainContainer topMargin={0}>
            <Typography
              color="white"
              variant="h1"
              fontSize="4.5rem"
              textAlign="center"
            >
              <TitleShadow>Oscar Night</TitleShadow>
            </Typography>
            <Typography
              color="white"
              textAlign="center"
              variant="h2"
              fontSize="1.2rem"
              pt="0.5rem"
              mb="3rem"
            >
              Social Prediction for the Academy Awards
            </Typography>
          </MainContainer>
        </MainWrapper>
      </HeroWrapper>
      <MainContainer>
        <Grid container spacing={2}>
          <Grid item sm={4} xs={12}>
            <Card
              sx={{
                flexGrow: 1,
                hyphens: 'auto',
                overflowWrap: 'break-word',
                flexBasis: 1 / 3
              }}
            >
              <CardMedia
                component="img"
                image="/images/gather.jpg"
                height="220"
              />
              <CardContent>
                <Typography variant="h3">Gather your friends</Typography>
                <Typography variant="body1" pt="1rem">
                  Find the cinephiles amongst your friends and challenge them
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item sm={4} xs={12}>
            <Card
              sx={{
                flexGrow: 1,
                hyphens: 'auto',
                overflowWrap: 'break-word',
                flexBasis: 1 / 3
              }}
            >
              <CardMedia
                component="img"
                image="/images/predict.png"
                height="220"
              />
              <CardContent>
                <Typography variant="h3">Predict winners</Typography>
                <Typography variant="body1" pt="1rem">
                  Privately choose which films will win in each category
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item sm={4} xs={12}>
            <Card
              sx={{
                flexGrow: 1,
                hyphens: 'auto',
                overflowWrap: 'break-word',
                flexBasis: 1 / 3
              }}
            >
              <CardMedia
                component="img"
                image="/images/live-view.png"
                height="220"
              />
              <CardContent>
                <Typography variant="h3">See results live</Typography>
                <Typography variant="body1" pt="1rem">
                  Follow the ceremony and see the results update live
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Box pt="3rem" width="60%" margin="0 auto" sx={{ textAlign: 'center' }}>
          <Typography variant="h1" component="h2">
            Get access!
          </Typography>
          <Typography variant="body1" pt="1rem">
            Oscar Night is currently under development and in closed alpha. If
            you want to be a part of the alpha testing, send me an e-mail at{' '}
            <a href="mailto:hello@oscarnight.app">hello@oscarnight.app</a>.
          </Typography>
          <Typography variant="body1" pt="1rem" mb="4rem">
            – Per Enström.
          </Typography>
        </Box>
      </MainContainer>
    </div>
  );
};

export default FrontPage;
