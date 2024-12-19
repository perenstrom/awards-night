import styles from './MainContainer.module.scss';

export const MainContainer: React.ElementType = ({ children }) => {
  return <div className={styles.container}>{children}</div>;
};
