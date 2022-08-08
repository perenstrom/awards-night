import { styled } from '@mui/material/styles';
import { BetIcon as BetIconType } from 'types/nominations';

import { defaultStyledOptions } from 'utils/mui';
import { getPlayerColor } from 'utils/playerColor';

interface NominationsProps {
  readonly visible?: boolean;
  readonly poster: string;
  readonly title: string;
  readonly nominee?: string;
  readonly bets: BetIconType[];
  readonly won: boolean;
}

interface NominationProps {
  readonly visible?: boolean;
  readonly won: boolean;
}
const Nomination = styled(
  'div',
  defaultStyledOptions<NominationProps>(['visible', 'won'])
)<NominationProps>`
  aspect-ratio: 9 / 4;
  width: 28.4em;
  height: 12.9em;
  opacity: ${({ visible }) => (visible ? '100%' : '0%')};
  transition: opacity 0.2s ease-in-out;
  box-sizing: border-box;
  background: #2c2c2c;
  border-radius: 0.25em;
  padding: 0.7em;
  overflow: hidden;

  display: grid;
  grid-template-columns: 7.7em 1fr;
  grid-template-rows: min-content min-content auto min-content;
  grid-template-areas:
    'poster title'
    'poster nominee'
    'poster .'
    'poster bets';

  color: #e5e7f8;
  font-family: 'Inter', sans-serif;
  box-shadow: ${({ won }) => (won ? '0px 0px 1em 0.4em #ffcb00' : 'none')};

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
  flex-wrap: wrap-reverse;
  gap: 0.6em;
  padding: 0 1em 0 0.7em;
`;

interface BetIconProps {
  readonly itemStyle: number;
}
const BetIcon = styled(
  'div',
  defaultStyledOptions<BetIconProps>(['itemStyle'])
)<BetIconProps>`
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

const Trophy = styled('div')`
  grid-area: 1 / 2 / -1 / -1;
  place-self: end;
  width: 9em;
  height: 8.6em;
  margin-inline-end: -0.7em;
  margin-block-end: -0.7em;

  & img {
    width: 100%;
  }
`;

export const NominatedFilm: React.FC<NominationsProps> = ({
  visible = false,
  poster,
  title,
  nominee,
  bets = [],
  won
}) => {
  return (
    <Nomination visible={visible} won={won}>
      <Poster>
        <Image src={poster} alt={title} />
      </Poster>
      {won && (
        <Trophy>
          <img src="/images/trophy.svg" alt="" />
        </Trophy>
      )}
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
