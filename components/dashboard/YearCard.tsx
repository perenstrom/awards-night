import { clsx } from 'clsx';
import Link from 'next/link';
import { Bet, NominationData } from 'types/nominations';
import styles from './YearCard.module.scss';
import { YearCardWrapper } from './YearCardWrapper';
import { YearCardChevron } from './YearCardChevron';

type YearState =
  | 'open' // year.bettingOpen && bets.length === 0
  | 'bettingInProgress' // year.bettingOpen && bets.length > 0
  | 'bettingDone' // year.bettingOpen && bets.length === categories.length
  | 'closed' // !year.bettingOpen && decidedCategories.length === 0
  | 'live' // !year.bettingOpen && decidedCategories.length > 0
  | 'complete' // !year.bettingOpen && decidedCategories.length === categories.length
  | 'noParticipation'; // !year.bettingOpen && bets.length === 0

const getYearState = (
  bettingOpen: boolean,
  numberOfBets: number,
  numberOfCategories: number,
  numberOfDecidedCategories: number
): YearState => {
  if (bettingOpen) {
    if (numberOfBets === 0) {
      return 'open';
    } else if (numberOfBets < numberOfCategories) {
      return 'bettingInProgress';
    } else {
      return 'bettingDone';
    }
  } else {
    if (numberOfBets === 0) {
      return 'noParticipation';
    } else if (numberOfDecidedCategories === 0) {
      return 'closed';
    } else if (numberOfDecidedCategories < numberOfCategories) {
      return 'live';
    } else {
      return 'complete';
    }
  }
};

const getYearStateText = (
  state: YearState,
  numberOfBets: number,
  numberOfCategories: number,
  numberOfDecidedCategories: number,
  numberOfWins: number
) => {
  switch (state) {
    case 'open':
      return 'Make your predictions!';
    case 'bettingInProgress':
      return `${numberOfBets}/${numberOfCategories} categories predicted`;
    case 'bettingDone':
      return 'You have made all your predictions!';
    case 'closed':
      return 'Predictions closed, awaiting winners';
    case 'live':
      return `Revealing winners, you have ${numberOfWins}/${numberOfDecidedCategories} correct`;
    case 'complete':
      return `You had ${numberOfWins}/${numberOfDecidedCategories} predictions correct`;
    case 'noParticipation':
      return 'You did not participate this year';
  }
};

const getProgressData = (
  state: YearState,
  numberOfBets: number,
  numberOfCategories: number,
  numberOfDecidedCategories: number,
  numberOfWins: number
) => {
  switch (state) {
    case 'open':
      return {
        primary: {
          value: 0,
          max: numberOfCategories,
          color: {
            background: 'backgroundGray',
            progress: 'progressOrange'
          }
        },
        secondary: null
      };
    case 'bettingInProgress':
      return {
        primary: {
          value: numberOfBets,
          max: numberOfCategories,
          color: {
            background: 'backgroundGray',
            progress: 'progressOrange'
          }
        },
        secondary: null
      };
    case 'bettingDone':
      return {
        primary: {
          value: numberOfCategories,
          max: numberOfCategories,
          color: {
            background: 'backgroundGray',
            progress: 'progressGreen'
          }
        },
        secondary: null
      };
    case 'closed':
      return {
        primary: {
          value: 0,
          max: numberOfCategories,
          color: {
            background: 'backgroundGray',
            progress: 'progressOrange'
          }
        },
        secondary: null
      };
    case 'live':
      return {
        primary: {
          value: numberOfDecidedCategories,
          max: numberOfCategories,
          color: {
            background: 'backgroundGray',
            progress: 'progressRed'
          }
        },
        secondary: {
          value: numberOfWins,
          max: numberOfCategories,
          color: {
            background: 'backgroundTransparent',
            progress: 'progressGreen'
          }
        }
      };
    case 'complete':
      return {
        primary: {
          value: numberOfWins,
          max: numberOfCategories,
          color: {
            background: 'backgroundRed',
            progress: 'progressGreen'
          }
        },
        secondary: null
      };
    case 'noParticipation':
      return {
        primary: {
          value: 0,
          max: numberOfCategories,
          color: {
            background: 'backgroundGray',
            progress: 'progressGreen'
          }
        },
        secondary: null
      };
  }
};

interface Props {
  nominationData: NominationData;
  bets: Bet[];
}

export const YearCard: React.FC<Props> = ({ nominationData, bets }) => {
  const { year } = nominationData;

  const numberOfCategories = Object.keys(nominationData.categories).length;
  const numberOfDecidedCategories = Object.values(
    nominationData.categories
  ).filter((category) => category.decided).length;

  const yearState = getYearState(
    year.bettingOpen,
    bets.length,
    numberOfCategories,
    numberOfDecidedCategories
  );

  const numberOfWins = bets.filter(
    (bet) => nominationData.nominations[bet.nomination].won
  ).length;

  const stateText = getYearStateText(
    yearState,
    bets.length,
    numberOfCategories,
    numberOfDecidedCategories,
    numberOfWins
  );
  const progressData = getProgressData(
    yearState,
    bets.length,
    numberOfCategories,
    numberOfDecidedCategories,
    numberOfWins
  );

  return (
    <Link className={styles.link} href={`/me/bets/${year.year}`}>
      <YearCardWrapper year={year.year}>
        <h2 className={styles.heading}>
          {year.year}
          <small className={styles.subHeading}> - {year.name}</small>
        </h2>
        <div className={styles.textAndChevronWrapper}>
          <p className={styles.stateText}>{stateText}</p>
          <YearCardChevron year={year.year} />
        </div>
        <div className={styles.progressWrapper}>
          <progress
            className={clsx([
              styles.progressBar,
              styles[progressData.primary.color.background],
              styles[progressData.primary.color.progress]
            ])}
            value={progressData.primary.value}
            max={progressData.primary.max}
          />
          {progressData.secondary && (
            <progress
              className={clsx([
                styles.progressBar,
                styles.progressBarSecondary,
                styles[progressData.secondary.color.background],
                styles[progressData.secondary.color.progress]
              ])}
              value={progressData.secondary.value}
              max={progressData.secondary.max}
            />
          )}
        </div>
      </YearCardWrapper>
    </Link>
  );
};
