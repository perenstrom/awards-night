import { memo } from 'react';
import {
  Bet,
  Nomination,
  NormalizedFilms,
  NormalizedPlayers
} from 'types/nominations';
import { Nullable } from 'types/utilityTypes';
import { NominatedFilm } from './NominatedFilm';
import styles from './Category.module.scss';

interface Props {
  nominations: Nomination[];
  films: NormalizedFilms;
  bets: Bet[];
  players: Nullable<NormalizedPlayers>;
}

const CategoryComponent: React.FC<Props> = ({
  nominations,
  films,
  bets: categoryBets,
  players
}) => {
  return (
    <ul className={styles.filmList}>
      {nominations.map((nomination) => (
        <NominatedFilm
          key={nomination.id}
          nomination={nomination}
          film={films[nomination.film]}
          bets={categoryBets.filter((bet) => bet.nomination === nomination.id)}
          players={players}
        />
      ))}
    </ul>
  );
};

export const Category = memo(CategoryComponent);
