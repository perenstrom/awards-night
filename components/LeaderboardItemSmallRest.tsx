import { styled } from '@mui/material/styles';

const Wrapper = styled('li')`
  flex-grow: 1;
  overflow: hidden;

  display: flex;
  gap: 0.5em;
  justify-content: center;
  align-items: center;

  margin-bottom: 0;
  padding: 0.2em 0.5em;
  border-radius: 0.5em;

  background: #989898;

  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 0.8em;
  color: #ffffff;
  text-shadow: 1px 0px 3px rgb(0, 0, 0), -1px 0px 3px rgb(0, 0, 0);

  &::before {
    counter-increment: position;
  }
`;

export const LeaderboardItemRest: React.FC<{}> = () => {
  return <Wrapper>...</Wrapper>;
};
