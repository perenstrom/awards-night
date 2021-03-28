import { memo } from 'react';
import styled from 'styled-components';
import { Category } from 'types/nominations';

interface WrapperProps {
  readonly activeBet: boolean;
}
const Wrapper = styled.li<WrapperProps>`
  display: flex;
  width: 100%;
  background-color: ${({ activeBet }) =>
    activeBet ? 'rgb(147, 161, 209)' : 'rgb(238, 238, 238)'};
  list-style: none;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border-radius: 3px;
  transition: background-color 300ms ease-out;
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
  filmName: string;
  poster: string;
  nominee: string;
  activeBet: boolean;
  updateBet: (string, Category) => void;
}

export const BetItem: React.FC<Props> = memo(
  ({
    category,
    nominationId,
    filmName,
    poster,
    nominee,
    activeBet,
    updateBet
  }) => {
    return (
      <Wrapper
        key={nominationId}
        activeBet={activeBet}
        onClick={() => updateBet(nominationId, category)}
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
