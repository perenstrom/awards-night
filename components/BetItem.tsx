import { memo } from 'react';
import { Typography, styled } from '@mui/material';
import { Category } from 'types/nominations';
import { defaultStyledOptions } from 'utils/mui';
import { FilmPoster } from './FilmPoster';

const getBackgroundColor = (
  activeBet: boolean,
  won: boolean,
  decided: boolean
): string => {
  if (activeBet && won) {
    // Green
    return 'rgb(135, 218, 161)';
  } else if (activeBet && decided && !won) {
    // Red
    return 'rgb(223, 121, 113)';
  } else if (activeBet && !decided && !won) {
    // Light blue
    return 'rgb(147, 161, 209)';
  } else if (!activeBet && won) {
    // Yellow
    return 'rgb(187, 162, 103)';
  } else if (!activeBet && !won) {
    // White
    return 'rgb(238, 238, 238)';
  } else {
    return 'rgb(238, 238, 238)';
  }
};

interface WrapperProps {
  readonly activeBet: boolean;
  readonly won: boolean;
  readonly decided: boolean;
  readonly bettingOpen: boolean;
}
const Wrapper = styled(
  'li',
  defaultStyledOptions([
    'activeBet',
    'bettingOpen',
    'decided',
    'won'
  ])
)<WrapperProps>`
  display: flex;
  width: 100%;
  background-color: ${({ activeBet, won, decided }) =>
    getBackgroundColor(activeBet, won, decided)};
  list-style: none;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border-radius: 3px;
  transition: background-color 300ms ease-out;
  cursor: ${({ bettingOpen }) => bettingOpen && 'pointer'};
`;

const InnerWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  padding-left: 1em;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
`;

interface Props {
  category: Category;
  nominationId: number;
  won: boolean;
  decided: boolean;
  filmName: string;
  poster: string;
  nominee: string;
  activeBet?: boolean;
  bettingOpen?: boolean;
  onClick: (nominationId: number, category: Category) => void;
}

export const BetItemComponent: React.FC<Props> = ({
  category,
  nominationId,
  won,
  decided,
  filmName,
  poster,
  nominee,
  activeBet = false,
  bettingOpen = true,
  onClick
}) => {
  return (
    <Wrapper
      key={nominationId}
      activeBet={activeBet}
      won={won}
      decided={decided}
      bettingOpen={bettingOpen}
      onClick={bettingOpen ? () => onClick(nominationId, category) : () => null}
    >
      <FilmPoster poster={poster} />
      <InnerWrapper>
        <Typography variant="h3">{filmName}</Typography>
        {nominee && <Typography>{nominee}</Typography>}
      </InnerWrapper>
    </Wrapper>
  );
};

export const BetItem = memo(BetItemComponent);
