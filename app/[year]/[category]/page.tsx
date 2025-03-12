import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { clsx } from 'clsx';
import { getNominationData } from 'lib/getNominationData';
import { BetIcon, BettingData, Nomination } from 'types/nominations';
import { NominatedFilm } from 'components/presentationMode/NominatedFilm';
import { getLoggedInPlayer } from 'lib/player';
import { getBettingData } from 'lib/getBettingData';
import { normalizeBets, normalizePlayers } from 'utils/normalizer';
import styles from './category.module.scss';

interface Props {
  params: Promise<{ year: string; category: string }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  return {
    title: `Nominations for ${params.year} - ${params.category}`
  };
}

export default async function Page(props: Props) {
  const rawParams = await props.params;
  const params = z
    .object({
      year: z.string(),
      category: z.string()
    })
    .safeParse(rawParams);

  if (params.success === false) redirect('/');

  const nominationData = await getNominationData(
    parseInt(params.data.year, 10)
  );
  if (!nominationData) redirect('/');
  const {
    films,
    categories: normalizedCategories,
    nominations: normalizedNominations
  } = nominationData;
  const category = normalizedCategories[params.data.category];

  const categoryNominations: Nomination[] = category.nominations.map(
    (n) => normalizedNominations[n]
  );

  const player = await getLoggedInPlayer();
  const bettingData: BettingData = player
    ? await getBettingData(nominationData, player.group || 0)
    : {
        bets: [],
        players: [],
        nominationBets: {}
      };

  const { players, bets, nominationBets } = bettingData;
  const normalizedPlayers = normalizePlayers(players);
  const normalizedBets = normalizeBets(bets);

  const prepareBets = (nominationId: number): BetIcon[] => {
    if (!normalizedPlayers || !normalizedBets || !nominationBets) {
      return [];
    }

    const betsForNomination = nominationBets[nominationId]
      ? nominationBets[nominationId].map((betId) => normalizedBets[betId])
      : [];

    const betIconData: BetIcon[] = betsForNomination.map((bet) => ({
      id: `${normalizedPlayers[bet.player].name}-${
        normalizedPlayers[bet.player].id
      }`,
      letter: normalizedPlayers[bet.player].name[0],
      style: normalizedPlayers[bet.player].style
    }));

    return betIconData;
  };

  return (
    <div className={styles.main}>
      <h1 className={styles.heading}>{category.name}</h1>
      <div
        className={clsx(styles.nominationsArea, {
          [styles.largeNomination]: categoryNominations.length <= 6
        })}
      >
        {categoryNominations.map((nomination) => (
          <NominatedFilm
            key={nomination.id}
            poster={films[nomination.film].poster}
            title={films[nomination.film].name}
            nominee={nomination.nominee}
            bets={prepareBets(nomination.id)}
            won={nomination.won}
          />
        ))}
      </div>
    </div>
  );
}
