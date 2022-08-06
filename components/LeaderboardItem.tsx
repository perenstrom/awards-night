import { styled } from '@mui/material/styles';

const Wrapper = styled('li')`
  display: flex;
  gap: 0.5em;
  justify-content: space-between;
  align-items: baseline;
  overflow: hidden;

  margin-bottom: 0.6em;
  padding: 0.2em 0.5em;
  border-radius: 0.5em;

  background: #ef8b2c;

  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 1em;
  color: #ffffff;
  text-shadow: 1px 0px 3px rgb(0, 0, 0), -1px 0px 3px rgb(0, 0, 0);

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

const Name = styled('div')`
  flex-grow: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 0.3em;
  margin: 0 -0.3em;
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
