import { memo } from 'react';
import { Film, Nomination } from 'types/nominations';
import styled from 'styled-components';

const Wrapper = styled.li`
  list-style: none;
  flex-grow: 1;
  flex-basis: 0;
  text-align: center;
  min-width: 200px;
  max-width: 15%;
  margin: 0 15px 30px 15px;
  padding: 0.5em;
  background-color: ${({ winner }) => winner && 'rgb(187, 162, 103)'};
`;

const Poster = styled.img`
  width: 100%;
`;

interface Props {
  nomination: Nomination;
  film: Film;
}

export const NominatedFilm: React.FC<Props> = memo(({ nomination, film }) => {
  return (
    <Wrapper>
      <Poster
        alt={film.name}
        src={`https://via.placeholder.com/500x700.png?text=${film.name}`}
      />
      <p>{nomination.nominee}</p>
    </Wrapper>
  );
});
