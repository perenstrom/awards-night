import { NextPage } from 'next';
import React from 'react';
import Head from 'next/head';
import { MainContainer } from 'components/MainContainer';
import {
  Card,
  CardContent,
  CardMedia,
  styled,
  Typography
} from '@mui/material';

interface Props {}

const HeroWrapper = styled('div')`
  display: flex;
  align-items: center;
  width: 100%;
  height: 20rem;
  background-color: black;
  background-image: url('/images/hero.jpg');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
`;

const TitleShadow = styled('span')`
  text-shadow: 0 0 3rem #000000;
`;

const CardWrapper = styled('div')`
  display: flex;
  gap: 1rem;
`;

const FrontPage: NextPage<Props> = () => {
  return (
    <div>
      <Head>
        <title>Oscar Night – Social prediction for the Academy Awards</title>
      </Head>
      <HeroWrapper>
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
      </HeroWrapper>
      <MainContainer>
        <CardWrapper>
          <Card sx={{ flexGrow: 1 }}>
            <CardMedia
              component="img"
              image="/images/live-view.png"
              height="140"
            />
            <CardContent>
              <Typography variant="h3">Gather your friends</Typography>
            </CardContent>
          </Card>
          <Card sx={{ flexGrow: 1 }}>
            <CardMedia
              component="img"
              image="/images/live-view.png"
              height="140"
            />
            <CardContent>
              <Typography variant="h3">Predict winners</Typography>
            </CardContent>
          </Card>
          <Card sx={{ flexGrow: 1 }}>
            <CardMedia
              component="img"
              image="/images/live-view.png"
              height="140"
            />
            <CardContent>
              <Typography variant="h3">See results live</Typography>
            </CardContent>
          </Card>
        </CardWrapper>
      </MainContainer>
    </div>
  );
};

export default FrontPage;
