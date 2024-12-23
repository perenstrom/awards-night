import { clsx } from 'clsx';
import styles from './LeaderboardItem.module.scss';

interface props {
  name: string;
  correct: number;
  total: number;
  itemStyle: number;
}

export const LeaderboardItem: React.FC<props> = ({
  name,
  correct,
  total,
  itemStyle
}) => {
  return (
    <li
      className={clsx(
        styles.wrapperLarge,
        styles[`playerColor${itemStyle}`]
      )}
    >
      <div className={styles.name}>{name}</div>
      <div className={styles.score}>
        {correct} / {total}
      </div>
    </li>
  );
};
