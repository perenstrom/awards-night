import { styled } from '@mui/material/styles';
import { LeaderboardItemName as Name } from './LeaderboardItemName';

const Wrapper = styled('li')`
  flex-grow: 1;

  background: #ef8b2c;

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
}

export const LeaderboardItemSmall: React.FC<props> = ({ name, correct }) => {
  return (
    <Wrapper>
      <Name>{name}</Name>
      <Score>{correct}</Score>
    </Wrapper>
  );
};
