import { clsx } from 'clsx';
import styles from './LeaderboardItem.module.scss';

interface props {
  name: string;
  correct: number;
  total: number;
  itemStyle: number;
  place?: number;
}

export const LeaderboardItem: React.FC<props> = ({
  name,
  correct,
  total,
  itemStyle,
  place
}) => {
  const text = place ? `${place}. ${name}` : name;
  return (
    <li
      className={clsx(styles.wrapperLarge, styles[`playerColor${itemStyle}`])}
    >
      <div className={styles.name}>{text}</div>
      <div className={styles.score}>
        {correct} / {total}
      </div>
    </li>
  );
};
