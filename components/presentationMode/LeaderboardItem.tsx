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
  li& {
    margin-bottom: 0.6em;
    font-size: 1em;
  }

  background-color: ${({ itemStyle }) => getPlayerColor(itemStyle).background};
  color: ${({ itemStyle }) => getPlayerColor(itemStyle).text};
  text-shadow: 1px 0px 3px ${({ itemStyle }) => getPlayerColor(itemStyle).glow},
    -1px 0px 3px ${({ itemStyle }) => getPlayerColor(itemStyle).glow};

  &::before {
    counter-increment: position;
    content: counter(position) '.';
  }

  &:first-of-type {
    font-size: 1.5em;
    margin-bottom: 0.4em;
    padding: 0.1em 0.4em;
  }
`;

const Score = styled('div')`
  font-size: 0.8em;
  white-space: nowrap;
`;

interface props {
  name: string;
  correct: number;
  total: number;
  itemStyle: number;
}

export const LeaderboardItem: React.FC<props> = ({
  name,
  correct,
  total,
  itemStyle
}) => {
  return (
    <Wrapper itemStyle={itemStyle}>
      <Name>{name}</Name>
      <Score>
        {correct} / {total}
      </Score>
    </Wrapper>
  );
};
