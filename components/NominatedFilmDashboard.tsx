import { styled } from '@mui/material/styles';
import { defaultStyledOptions } from 'utils/mui';

interface Size {
  width: number;
  height: number;
  restrictedBy: 'height' | 'width';
}
interface NominationsProps {
  readonly size: Size | null;
  readonly visible?: boolean;
}

const getSize = (size: Size) => {
  switch (size.restrictedBy) {
    case 'height':
      return {
        height: `calc(calc(${size.height - 1}px - 2rem)/3)`,
        width: 'unset'
      };
    case 'width':
      return {
        height: 'unset',
        width: `calc(calc(${size.width - 1}px - 1rem)/2)`
      };
  }
};

const Nomination = styled(
  'div',
  defaultStyledOptions<NominationsProps>(['size', 'visible'])
)<NominationsProps>`
  aspect-ratio: 9 / 4;
  width: ${({ size }) => (size ? getSize(size).width : '0px')};
  height: ${({ size }) => (size ? getSize(size).height : '0px')};
  opacity: ${({ visible }) => (visible ? '100%' : '0%')};
  transition: opacity 0.2s ease-in-out;
  box-sizing: border-box;
  background: #2c2c2c;
  border-radius: 0.25em;
  padding: 0.7em;

  display: grid;
  grid-template-columns: 8em 1fr;
  grid-template-rows: min-content min-content auto min-content;
  grid-template-areas:
    'poster title'
    'poster nominee'
    'poster .'
    'poster bets';

  color: #e5e7f8;
  font-family: 'Inter', sans-serif;

  #poster {
    grid-area: poster;
  }
  #title {
    grid-area: title;

    font-size: 1.5em;
    font-weight: 700;
    line-height: 1.2;
    padding: 0.3em 1em 0 0.6em;
  }
  #nominee {
    grid-area: nominee;
    font-family: 'Charis SIL', serif;
    font-style: italic;
    font-size: 1.3em;
    line-height: 1.2;
    padding: 0.2em 1em 0 0.6em;
  }
  #bets {
    grid-area: bets;
    display: flex;
    flex-wrap: wrap;
    gap: 0.6em;
    padding: 0 1em 0 0.7em;
  }
`;

const Image = styled('img')`
  display: block;
  width: 100%;
`;

export const NominatedFilm: React.FC<NominationsProps> = ({
  size,
  visible = false
}) => {
  return (
    <Nomination size={size} visible={visible}>
      <div id="poster">
        <Image src="https://image.tmdb.org/t/p/w342/y89kFMNYXNKMdlZjR2yg7nQtcQH.jpg" />
      </div>
      <div id="title">Everything everywhere all at once</div>
      <div id="nominee">Michelle Yeoh</div>
      <div id="bets">
        <BetIcon>P</BetIcon>
        <BetIcon>P</BetIcon>
        <BetIcon>P</BetIcon>
        <BetIcon>P</BetIcon>
      </div>
    </Nomination>
  );
};

const BetIcon = styled('div')`
  border-radius: 50%;
  background-color: #ef8b2c;
  color: white;
  width: 1.6em;
  height: 1.6em;
  display: flex;
  align-items: center;
  justify-content: center;

  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 1.6em;
`;
