import { clsx } from 'clsx';
import { memo } from 'react';
import { FilmPoster } from './FilmPoster';
import styles from './BetItem.module.scss';
import { CheckboxWrapper } from './dashboard/CheckboxWrapper';

interface Props {
  nominationId: number;
  won: boolean;
  decided: boolean;
  filmName: string;
  poster: string;
  nominee: string;
  activeBet?: boolean;
  disabled?: boolean;
}

const getState = (won: boolean, decided: boolean, activeBet: boolean) => {
  if (!decided || !activeBet) return 'neutral';
  return won && activeBet ? 'correct' : 'incorrect';
};

export const BetItemComponent: React.FC<Props> = ({
  nominationId,
  won,
  filmName,
  poster,
  nominee,
  decided,
  activeBet = false,
  disabled = false
}) => {
  return (
    <button
      className={styles.button}
      type="submit"
      name="nominationId"
      value={nominationId}
      disabled={disabled}
    >
      <li
        className={clsx(styles.wrapper, {
          [styles.winner]: won,
          [styles.pointer]: !disabled
        })}
        key={nominationId}
      >
        <CheckboxWrapper
          selected={activeBet}
          nominationId={nominationId}
          state={getState(won, decided, activeBet)}
        />
        <FilmPoster poster={poster} />
        <div className={styles.innerWrapper}>
          <h3 className={styles.title}>{filmName}</h3>
          {nominee && <p className={styles.nominee}>{nominee}</p>}
        </div>
      </li>
    </button>
  );
};

export const BetItem = memo(BetItemComponent);
