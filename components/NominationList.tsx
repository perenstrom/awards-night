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
}> = async ({ formAction, nominationData, playerBets }) => {
  const { year, categories, nominations, films } = nominationData;

  return (
    <form action={formAction}>
      <input type="hidden" name="year" value={year.year} />
      {(Object.values(categories) as Category[]).map((category) => (
        <div key={category.slug}>
          <Typography variant="h2">{category.name}</Typography>
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
                  bettingOpen={year.bettingOpen}
                />
              );
            })}
          </ul>
        </div>
      ))}
    </form>
  );
};
