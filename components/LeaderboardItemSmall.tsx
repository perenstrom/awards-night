import { styled } from '@mui/material/styles';

const Wrapper = styled('li')`
  flex-grow: 1;
  overflow: hidden;

  display: flex;
  gap: 0.5em;
  justify-content: space-between;
  align-items: baseline;

  margin-bottom: 0;
  padding: 0.2em 0.5em;
  border-radius: 0.5em;

  background: #ef8b2c;

  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 0.8em;
  color: #ffffff;
  text-shadow: 1px 0px 3px rgb(0, 0, 0), -1px 0px 3px rgb(0, 0, 0);

  &::before {
    counter-increment: position;
  }
`;

const Name = styled('div')`
  flex-grow: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 0.3em;
  margin: 0 -0.3em;
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
