import { clsx } from 'clsx';
import { BetIcon as BetIconType } from 'types/nominations';
import styles from './NominatedFilm.module.scss';

interface NominationsProps {
  readonly visible?: boolean;
  readonly poster: string;
  readonly title: string;
  readonly nominee?: string;
  readonly bets: BetIconType[];
  readonly won: boolean;
}

export const NominatedFilm: React.FC<NominationsProps> = ({
  poster,
  title,
  nominee,
  bets = [],
  won
}) => {
  return (
    <div
      className={clsx(styles.nomination, {
        [styles.won]: won
      })}
    >
      <div className={styles.poster}>
        <img className={styles.image} src={poster} alt={title} />
      </div>
      {won && (
        <div className={styles.trophy}>
          <img src="/images/trophy.svg" alt="" />
        </div>
      )}
      <div className={styles.title}>{title}</div>
      <div className={styles.nominee}>{nominee}</div>
      <div className={styles.bets}>
        {bets.map((bet) => (
          <div
            className={clsx(styles.betIcon, styles[`playerColor${bet.style}`])}
            key={bet.id}
          >
            {bet.letter}
          </div>
        ))}
      </div>
    </div>
  );
};
