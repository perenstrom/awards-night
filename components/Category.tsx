import { memo } from 'react';
import {
  Nomination,
  NormalizedBets,
  NormalizedFilms,
  NormalizedPlayers
} from 'types/nominations';
import { NominatedFilm } from './NominatedFilm';
import { styled } from '@mui/material';

const FilmList = styled('ul')`
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

const CategoryComponent: React.FC<Props> = ({
  nominations,
  films,
  bets,
  players
}) => {
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
};

export const Category = memo(CategoryComponent);
