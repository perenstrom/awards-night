import { styled } from '@mui/material/styles';
import { LeaderboardItem } from 'components/LeaderboardItem';
import { LeaderboardItemSmall } from 'components/LeaderboardItemSmall';
import { LeaderboardItemRest } from 'components/LeaderboardItemSmallRest';
import { NominatedFilm } from 'components/NominatedFilmDashboard';
import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';

const MainWrapper = styled('div')`
  display: flex;
  height: 100%;
  width: 100%;
`;

const Sidebar = styled('div')`
  flex-basis: 20em;
  background: #363636;
  flex-grow: 0;
  border-right: 0.5px solid #696b7e;
  overflow: hidden;

  padding: 2em 1em 1em 1em;
`;

const Main = styled('div')`
  background: linear-gradient(180deg, #24242e 0%, #111115 24.3%);
  flex-grow: 1;

  display: flex;
  flex-direction: column;
  flex-basis: 100%;
  padding: 3em;
  padding-top: 1em;
`;

const Heading = styled('h1')`
  font-family: 'Inter', sans-serif;
  font-weight: 300;
  font-size: 2.7em;
  color: #e5e7f8;
  margin: 0;
  padding-bottom: 0.2em;
`;

const SubHeading = styled('h2')`
  font-family: 'Inter', sans-serif;
  font-weight: 300;
  font-size: 1.7em;
  color: #e5e7f8;
  margin: 0;
  padding-bottom: 0.2em;
`;

const SubHeadingSmall = styled('h2')`
  font-family: 'Inter', sans-serif;
  font-weight: 300;
  font-size: 1.2em;
  color: #e5e7f8;
  margin: 1em 0 0.2em;
`;

const Leaderboard = styled('ol')`
  margin: 0 0 0.5em 0;
  padding: 0;

  ol& {
    counter-reset: position;
  }
`;

const LeaderboardOverflow = styled('li')`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.5em;
`;

const Categories = styled('ul')`
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 0.8em;
  color: #e5e7f8;
  line-height: 1.5;
  margin: 0 0 0.5em 0;
  padding: 0;
  list-style: none;
`;

const Category = styled('li')`
  padding: 0;
  //color: #EF8B2C;
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
    // heigh: 16 / 800, width: 16 / 1200
    <MainWrapper
      style={{
        fontSize: nominationSize?.restrictedBy === 'height' ? '2vh' : '1.2vw'
      }}
    >
      <Sidebar>
        <SubHeading>Leaderboard</SubHeading>
        <Leaderboard>
          <LeaderboardItem name="Per" correct={7} total={10} />
          <LeaderboardItem name="Jobjörn Folkesson asdf" correct={6} total={10} />
          <LeaderboardItem name="Hedvig" correct={5} total={10} />
          <LeaderboardItem name="Henrik" correct={4} total={10} />
          <LeaderboardOverflow>
            <LeaderboardItemSmall name="Staffan asf" correct={3} />
            <LeaderboardItemSmall name="Rozbe" correct={3} />
            <LeaderboardItemSmall name="Lena" correct={2} />
            <LeaderboardItemSmall name="Leo" correct={1} />
            <LeaderboardItemSmall name="Staffan asf" correct={3} />
            <LeaderboardItemRest />
          </LeaderboardOverflow>
        </Leaderboard>
        <SubHeadingSmall>Completed categories</SubHeadingSmall>
        <Categories>
          <Category>Best Sound</Category>
          <Category>Best Visual Effects</Category>
          <Category>Best Animated Short</Category>
          <Category>Best Animated Feature</Category>
          <Category>Best Documentary</Category>
          <Category>Best Hair and Makeup</Category>
          <Category>Best Costume Design</Category>
          <Category>Best Production Design</Category>
          <Category>Best Live Action Short</Category>
          <Category>Best Actress</Category>
        </Categories>
        <SubHeadingSmall>Upcoming categories</SubHeadingSmall>
        <Categories>
          <Category>Best Actor</Category>
          <Category>Best Adapted Screenplay</Category>
          <Category>Best Cinematography</Category>
          <Category>Best Director</Category>
          <Category>Best Documentary Feature</Category>
          <Category>Best Film Editing</Category>
          <Category>Best International Film</Category>
          <Category>Best Original Score</Category>
          <Category>Best Original Screenplay</Category>
          <Category>Best Original Song</Category>
          <Category>Best Picture</Category>
          <Category>Best Supporting Actor</Category>
          <Category>Best Supporting Actress</Category>
        </Categories>
      </Sidebar>
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
