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
  padding: 1rem;
  margin-bottom: 0.5rem;
`;

const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 1em;
`;

const Poster = styled.img`
  margin: -0.5rem;
`;

const NominationHeader = styled.h3`
  margin: 0;
`;

interface Props {
  category: Category;
  nominationId: string;
  filmName: string;
  nominee: string;
  activeBet: boolean;
  updateBet: (string, Category) => void;
}

export const BetItem: React.FC<Props> = memo(
  ({ category, nominationId, filmName, nominee, activeBet, updateBet }) => {
    return (
      <Wrapper
        key={nominationId}
        activeBet={activeBet}
        onClick={() => updateBet(nominationId, category)}
      >
        <Poster src="https://via.placeholder.com/50x70" width="50" height="70" />
        <InnerWrapper>
          <NominationHeader>{filmName}</NominationHeader>
          {nominee && <p>{nominee}</p>}
        </InnerWrapper>
      </Wrapper>
    );
  }
);
