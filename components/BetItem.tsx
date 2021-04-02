import { memo } from 'react';
import styled from 'styled-components';
import { Category } from 'types/nominations';

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

const NominationHeader = styled.h3`
  margin: 0;
`;

interface Props {
  category: Category;
  nominationId: string;
  won: boolean;
  decided: boolean;
  filmName: string;
  poster: string;
  nominee: string;
  activeBet?: boolean;
  bettingOpen?: boolean;
  onClick: (string, Category) => void;
}

export const BetItem: React.FC<Props> = memo(
  ({
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
        onClick={
          bettingOpen ? () => onClick(nominationId, category) : () => null
        }
      >
        <PosterWrapper>
          <div>
            <Poster src={poster} width="48" height="72" />
            <Frame></Frame>
          </div>
        </PosterWrapper>
        <InnerWrapper>
          <NominationHeader>{filmName}</NominationHeader>
          {nominee && <p>{nominee}</p>}
        </InnerWrapper>
      </Wrapper>
    );
  }
);
