import { memo } from 'react';
import {
  Nomination,
  NormalizedBets,
  NormalizedFilms,
  NormalizedPlayers
} from 'types/nominations';
import styled from 'styled-components';
import { NominatedFilm } from './NominatedFilm';

const FilmList = styled.ul`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
  margin: 0px;
  padding: 1em;
`;

interface Props {
  nominations: Nomination[];
  films: NormalizedFilms;
  bets: NormalizedBets;
  players: NormalizedPlayers;
}

export const Category: React.FC<Props> = memo(
  ({ nominations, films, bets, players }) => {
    return (
      <FilmList>
        {nominations.map((nomination) => (
          <NominatedFilm
            key={nomination.id}
            nomination={nomination}
            film={films[nomination.film]}
            bets={bets}
            players={players}
          />
        ))}
      </FilmList>
    );
  }
);
