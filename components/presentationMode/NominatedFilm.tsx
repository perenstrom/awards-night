import { styled } from '@mui/material/styles';
import { BetIcon as BetIconType } from 'types/nominations';

import { defaultStyledOptions } from 'utils/mui';
import { getPlayerColor } from 'utils/playerColor';

interface Size {
  width: number;
  height: number;
  restrictedBy: 'height' | 'width';
}

interface NominationsProps {
  readonly size: Size | null;
  readonly visible?: boolean;
  readonly poster: string;
  readonly title: string;
  readonly nominee?: string;
  readonly bets: BetIconType[];
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
  defaultStyledOptions<{
    readonly size: Size | null;
    readonly visible?: boolean;
  }>(['size', 'visible'])
)<{ readonly size: Size | null; readonly visible?: boolean }>`
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

  #bets {
  }
`;

const Poster = styled('div')`
  grid-area: poster;
`;

const Image = styled('img')`
  display: block;
  width: 100%;
`;

const Title = styled('div')`
  grid-area: title;

  font-size: 1.5em;
  font-weight: 700;
  line-height: 1.2;
  padding: 0.3em 1em 0 0.6em;
`;

const Nominee = styled('div')`
  grid-area: nominee;
  font-family: 'Charis SIL', serif;
  font-style: italic;
  font-size: 1.3em;
  line-height: 1.2;
  padding: 0.2em 1em 0 0.6em;
`;

const Bets = styled('div')`
  grid-area: bets;
  display: flex;
  flex-wrap: wrap;
  gap: 0.6em;
  padding: 0 1em 0 0.7em;
`;

const BetIcon = styled(
  'div',
  defaultStyledOptions<{
    readonly itemStyle: number;
  }>(['itemStyle'])
)<{
  readonly itemStyle: number;
}>`
  border-radius: 50%;
  background-color: ${({ itemStyle }) => getPlayerColor(itemStyle).background};
  color: ${({ itemStyle }) => getPlayerColor(itemStyle).text};
  width: 1.6em;
  height: 1.6em;
  display: flex;
  align-items: center;
  justify-content: center;

  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 1.6em;
`;

export const NominatedFilm: React.FC<NominationsProps> = ({
  size,
  visible = false,
  poster,
  title,
  nominee,
  bets = []
}) => {
  return (
    <Nomination size={size} visible={visible}>
      <Poster>
        <Image src={poster} alt={title} />
      </Poster>
      <Title>{title}</Title>
      <Nominee>{nominee}</Nominee>
      <Bets>
        {bets.map((bet) => (
          <BetIcon key={bet.id} itemStyle={bet.style}>
            {bet.letter}
          </BetIcon>
        ))}
      </Bets>
    </Nomination>
  );
};
