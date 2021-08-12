import { memo } from 'react';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';
import { Category, NominationId } from 'types/nominations';

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
  }
};

interface WrapperProps {
  readonly activeBet: boolean;
  readonly won: boolean;
  readonly decided: boolean;
  readonly bettingOpen: boolean;
}
const Wrapper = styled.li<WrapperProps>`
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

const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 1em;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
`;

const PosterWrapper = styled.div`
  position: relative;
  overflow: hidden;
`;

const PosterInnerWrapper = styled.div`
  position: relative;
`;

const Poster = styled.img`
  display: block;
  border-radius: 4px;
`;

const Frame = styled.span`
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  overflow: hidden;
  border-radius: 4px;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.15);
  background-image: linear-gradient(
    90deg,
    hsla(0, 0%, 100%, 0) 0,
    hsla(0, 0%, 100%, 0.8) 50%,
    hsla(0, 0%, 100%, 0)
  );
  background-repeat: no-repeat;
  background-clip: padding-box;
  background-size: 100% 1px;
`;

interface Props {
  category: Category;
  nominationId: NominationId;
  won: boolean;
  decided: boolean;
  filmName: string;
  poster: string;
  nominee: string;
  activeBet?: boolean;
  bettingOpen?: boolean;
  onClick: (nominationId: NominationId, category: Category) => void;
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
      <PosterWrapper>
        <PosterInnerWrapper>
          <Poster src={poster} width="48" height="72" />
          <Frame></Frame>
        </PosterInnerWrapper>
      </PosterWrapper>
      <InnerWrapper>
        <Typography variant="h3">{filmName}</Typography>
        {nominee && <Typography>{nominee}</Typography>}
      </InnerWrapper>
    </Wrapper>
  );
};

export const BetItem = memo(BetItemComponent);
