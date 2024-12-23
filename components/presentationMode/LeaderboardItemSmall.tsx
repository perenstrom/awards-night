import { clsx } from 'clsx';
import styles from './LeaderboardItem.module.scss';

interface props {
  name: string;
  correct: number;
  itemStyle: number;
  showScore?: boolean;
}

export const LeaderboardItemSmall: React.FC<props> = ({
  name,
  correct,
  itemStyle,
  showScore = true
}) => {
  return (
    <li
      className={clsx(
        styles.wrapperSmall,
        styles[`playerColor${itemStyle}`]
      )}
    >
      <div className={styles.name}>{name}</div>
      {showScore && <div className={styles.smallScore}>{correct}</div>}
    </li>
  );
};
