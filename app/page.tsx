import { LoginLink } from 'components/LoginLink';
import styles from './index.module.scss';

export default function Page() {
  return (
    <div className={styles.main}>
      <div className={styles.heroWrapper}>
        <LoginLink />
        <div className={styles.mainWrapper}>
          <div className={styles.myContainer}>
            <h1 className={styles.heading}>Awards Night</h1>
            <h2 className={styles.subHeading}>
              Social Prediction for the Academy Awards
            </h2>
          </div>
        </div>
      </div>
      <div className={styles.mainWrapper}>
        <div className={styles.featuresContainer}>
          <div className={styles.gridWrapper}>
            <div className={styles.gridItem}>
              <img
                className={styles.cardImage}
                src="/images/gather.jpg"
                alt="Image of friends sitting around a camp fire"
                height="220"
              />
              <div className={styles.cardContent}>
                <h3 className={styles.featureHeading}>Gather your friends</h3>
                <p className={styles.bodyText}>
                  Find the cinephiles amongst your friends and challenge them
                </p>
              </div>
            </div>
            <div className={styles.gridItem}>
              <img
                className={styles.cardImage}
                src="/images/predict.png"
                alt="Screenshot of a list of movies being marked"
                height="220"
              />
              <div className={styles.cardContent}>
                <h3 className={styles.featureHeading}>Predict winners</h3>
                <p className={styles.bodyText}>
                  Privately choose which films will win in each category
                </p>
              </div>
            </div>
            <div className={styles.gridItem}>
              <img
                className={styles.cardImage}
                src="/images/live-view.png"
                alt="Screenshot of a category of movies with a score board"
                height="220"
              />
              <div className={styles.cardContent}>
                <h3 className={styles.featureHeading}>See results live</h3>
                <p className={styles.bodyText}>
                  Follow the ceremony and see the results update live
                </p>
              </div>
            </div>
          </div>
          <div className={styles.accessWrapper}>
            <h2 className={styles.accessHeading}>Get access!</h2>
            <p className={styles.bodyText}>
              Awards Night is currently under development and in closed alpha.
              If you want to be a part of the alpha testing, send me an e-mail
              at{' '}
              <a href="mailto:hello@awardsnight.app">hello@awardsnight.app</a>.
            </p>
            <p className={styles.bodyText}>– Per Enström.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
