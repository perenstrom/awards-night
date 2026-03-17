import { BetIcon as BetIconType } from 'types/nominations';
import styles from './NominatedFilm.module.css';

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
      className={styles.container}
      style={
        won
          ? { boxShadow: '0px 0px 1em 0.4em var(--color-winner-yellow)' }
          : undefined
      }
    >
      <div className={styles.poster}>
        <img className={styles.image} src={poster} alt={title} />
      </div>
      {won && (
        <div className={styles.trophy}>
          <img src="/images/trophy.svg" alt="" />
        </div>
      )}
      <div className={styles.title}>
        {title}
      </div>
      <div className={styles.nominee}>
        {nominee}
      </div>
      <div className={styles.bets}>
        {bets.map((bet) => {
          const colorKey =
            bet.style >= 0 && bet.style <= 11 ? String(bet.style) : 'default';
          return (
            <div
              key={bet.id}
              className={styles.betIcon}
              style={{
                backgroundColor: `var(--player-color-${colorKey}-background)`,
                color: `var(--player-color-${colorKey}-text)`
              }}
            >
              {bet.letter}
            </div>
          );
        })}
      </div>
    </div>
  );
};
