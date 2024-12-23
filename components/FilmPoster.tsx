import styles from './FilmPoster.module.scss';

interface Props {
  poster: string;
}

export const FilmPoster: React.FC<Props> = ({ poster }) => (
  <div className={styles.wrapper}>
    <div className={styles.innerWrapper}>
      <img className={styles.poster} src={poster} alt="Poster image" />
      <span className={styles.frame}></span>
    </div>
  </div>
);
