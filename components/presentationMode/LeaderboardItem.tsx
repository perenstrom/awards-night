import { styled } from '@mui/material/styles';
import { LeaderboardItemName as Name } from './LeaderboardItemName';

const Wrapper = styled('li')`
  li& {
    margin-bottom: 0.6em;
    font-size: 1em;
  }

  background: #ef8b2c;

  &::before {
    counter-increment: position;
    content: counter(position) '.';
  }

  &:first-child {
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
}

export const LeaderboardItem: React.FC<props> = ({ name, correct, total }) => {
  return (
    <Wrapper>
      <Name>{name}</Name>
      <Score>
        {correct} / {total}
      </Score>
    </Wrapper>
  );
};
