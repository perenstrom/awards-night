import { memo } from 'react';
import {
  Bet,
  Nomination,
  NormalizedFilms,
  NormalizedPlayers
} from 'types/nominations';
import { NominatedFilm } from './NominatedFilm';
import { styled } from '@mui/material';

const FilmList = styled('ul')`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
  align-items: flex-start;
  margin: 0px;
  padding: 1em;
`;

interface Props {
  nominations: Nomination[];
  films: NormalizedFilms;
  bets: Bet[];
  players: NormalizedPlayers;
}

const CategoryComponent: React.FC<Props> = ({
  nominations,
  films,
  bets: categoryBets,
  players
}) => {
  return (
    <FilmList>
      {nominations.map((nomination) => (
        <NominatedFilm
          key={nomination.id}
          nomination={nomination}
          film={films[nomination.film]}
          bets={categoryBets.filter((bet) => bet.nomination === nomination.id)}
          players={players}
        />
      ))}
    </FilmList>
  );
};

export const Category = memo(CategoryComponent);
