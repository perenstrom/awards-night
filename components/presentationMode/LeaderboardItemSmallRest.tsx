import { styled } from '@mui/material/styles';

const Wrapper = styled('li')`
  li& {
    flex-grow: 1;

    justify-content: center;
    align-items: center;

    background: #989898;
  }
  
  &::before {
    counter-increment: position;
  }
`;

export const LeaderboardItemRest: React.FC<{}> = () => {
  return <Wrapper>...</Wrapper>;
};
