import { clsx } from 'clsx';
import { memo } from 'react';
import { Typography } from '@mui/material';
import { FilmPoster } from './FilmPoster';
import styles from './BetItem.module.scss';

const getBackgroundColor = (
  activeBet: boolean,
  won: boolean,
  decided: boolean
): string => {
  if (activeBet && won) {
    // Green
    return 'correct';
  } else if (activeBet && decided && !won) {
    // Red
    return 'wrong';
  } else if (activeBet && !decided && !won) {
    // Light blue
    return 'selected';
  } else if (!activeBet && won) {
    // Yellow
    return 'winner';
  } else if (!activeBet && !won) {
    // White
    return 'white';
  } else {
    return 'white';
  }
};

interface Props {
  nominationId: number;
  won: boolean;
  decided: boolean;
  filmName: string;
  poster: string;
  nominee: string;
  activeBet?: boolean;
  bettingOpen?: boolean;
}

export const BetItemComponent: React.FC<Props> = ({
  nominationId,
  won,
  decided,
  filmName,
  poster,
  nominee,
  activeBet = false,
  bettingOpen = true
}) => {
  return (
    <button
      className={styles.button}
      type="submit"
      name="nominationId"
      value={nominationId}
    >
      <li
        className={clsx(
          styles.wrapper,
          styles[getBackgroundColor(activeBet, won, decided)],
          {
            [styles.pointer]: bettingOpen
          }
        )}
        key={nominationId}
      >
        <FilmPoster poster={poster} />
        <div className={styles.innerWrapper}>
          <Typography variant="h3">{filmName}</Typography>
          {nominee && <Typography>{nominee}</Typography>}
        </div>
      </li>
    </button>
  );
};

export const BetItem = memo(BetItemComponent);
