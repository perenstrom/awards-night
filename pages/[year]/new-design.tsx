import { styled } from '@mui/material/styles';
import { NominatedFilm } from 'components/NominatedFilmDashboard';
import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';

const MainWrapper = styled('div')`
  display: flex;
  height: 100%;
  width: 100%;
  font-size: 16px;
`;

const Sidebar = styled('div')`
  flex-basis: 20em;
  background: #363636;
  flex-grow: 0;
`;

const Main = styled('div')`
  background: linear-gradient(180deg, #24242e 0%, #111115 24.3%);
  flex-grow: 1;

  display: flex;
  flex-direction: column;
  flex-basis: 100%;
  padding: 3em;
`;

const Heading = styled('h1')`
  font-family: 'Inter', sans-serif;
  font-weight: 300;
  font-size: 3.5em;
  color: #e5e7f8;
  margin: 0;
  padding-bottom: 1rem;
`;

interface Size {
  width: number;
  height: number;
  restrictedBy: 'height' | 'width';
}

const NominationsArea = styled('div')`
  height: 100%;
  font-size: 1em;
  gap: 1em;

  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  align-content: flex-start;
  justify-content: flex-start;
`;

const AREA_ID = 'nominations-area';

const getNominationSize = (): Size | null => {
  if (typeof window !== 'undefined') {
    const $nominationsArea = document.getElementById(AREA_ID);

    if ($nominationsArea) {
      const emSize = parseInt(
        getComputedStyle($nominationsArea).fontSize.slice(0, -2),
        10
      );

      const nominationsAreaWidth = $nominationsArea.offsetWidth;
      const nominationsAreaHeight = $nominationsArea.offsetHeight;

      const contentWidth = nominationsAreaWidth - emSize;
      const contentHeight = nominationsAreaHeight - 2 * emSize;

      const contentRatio = contentWidth / contentHeight;
      const cardRatio = 3 / 2;

      const restrictedBy = contentRatio >= cardRatio ? 'height' : 'width';

      return {
        width: nominationsAreaWidth,
        height: nominationsAreaHeight,
        restrictedBy: restrictedBy
      };
    }
  }

  return null;
};

const NewDesignPage: NextPage<{}> = () => {
  const nominationSize = getNominationSize();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (nominationSize) {
      const timeOut = setTimeout(() => setVisible(true), 100);

      return () => clearTimeout(timeOut);
    }
  }, [nominationSize]);

  return (
    <MainWrapper>
      <Sidebar>Sidebar</Sidebar>
      <Main>
        <Heading>Best Actress</Heading>
        <NominationsArea id={AREA_ID}>
          <NominatedFilm size={nominationSize} visible={visible} />
          <NominatedFilm size={nominationSize} visible={visible} />
          <NominatedFilm size={nominationSize} visible={visible} />
          <NominatedFilm size={nominationSize} visible={visible} />
          <NominatedFilm size={nominationSize} visible={visible} />
        </NominationsArea>
      </Main>
    </MainWrapper>
  );
};

export default NewDesignPage;
