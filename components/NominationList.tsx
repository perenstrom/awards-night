import { Bet, Category, NominationData } from 'types/nominations';
import { FormAction } from 'types/utilityTypes';
import { getBetForNomination } from 'utils/nominations';
import { BetItem } from './BetItem';
import { Typography } from './base/Typography';
import styles from './NominationList.module.scss';

export const NominationList: React.FC<{
  formAction: FormAction;
  nominationData: NominationData;
  playerBets?: Bet[];
  actionDisabled: boolean;
}> = async ({ formAction, nominationData, playerBets, actionDisabled }) => {
  const { year, categories, nominations, films } = nominationData;

  return (Object.values(categories) as Category[]).map((category) => (
    <form action={formAction} key={category.slug}>
      <input type="hidden" name="year" value={year.year} />
      <div className={styles.categoryWrapper}>
        <Typography variant="h2" color="white">
          {category.name}
        </Typography>
        <ul className={styles.listWrapper}>
          {category.nominations.map((nominationId) => {
            const nomination = nominations[nominationId];

            return (
              <BetItem
                key={nomination.id}
                nominationId={nomination.id}
                won={nomination.won}
                decided={nomination.decided}
                filmName={films[nomination.film].name}
                poster={films[nomination.film].poster}
                nominee={nomination.nominee}
                activeBet={
                  playerBets
                    ? !!getBetForNomination(playerBets, nomination.id)
                    : false
                }
                disabled={actionDisabled}
              />
            );
          })}
        </ul>
      </div>
    </form>
  ));
};
