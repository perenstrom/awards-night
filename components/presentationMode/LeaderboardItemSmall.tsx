import { styled } from '@mui/material/styles';
import { defaultStyledOptions } from 'utils/mui';
import { getPlayerColor } from 'utils/playerColor';
import { LeaderboardItemName as Name } from './LeaderboardItemName';

const Wrapper = styled(
  'li',
  defaultStyledOptions<{
    readonly itemStyle: number;
  }>(['itemStyle'])
)<{
  readonly itemStyle: number;
}>`
  flex-grow: 1;

  background-color: ${({ itemStyle }) => getPlayerColor(itemStyle).background};
  color: ${({ itemStyle }) => getPlayerColor(itemStyle).text};
  text-shadow: 1px 0px 3px ${({ itemStyle }) => getPlayerColor(itemStyle).glow},
    -1px 0px 3px ${({ itemStyle }) => getPlayerColor(itemStyle).glow};

  &::before {
    counter-increment: position;
  }
`;

const Score = styled('div')`
  flex-grow: 0;
`;

interface props {
  name: string;
  correct: number;
  itemStyle: number;
}

export const LeaderboardItemSmall: React.FC<props> = ({
  name,
  correct,
  itemStyle
}) => {
  return (
    <Wrapper itemStyle={itemStyle}>
      <Name>{name}</Name>
      <Score>{correct}</Score>
    </Wrapper>
  );
};
