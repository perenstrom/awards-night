import Airtable from 'airtable';
import AirtableRecord from 'airtable/lib/record';
import { Bet, Category, Film, Nomination, Player } from 'types/nominations';

const base = new Airtable().base(process.env.AIRTABLE_DATABASE);
const categoriesBase = base('categories');
const nominationsBase = base('nominations');
const filmsBase = base('films');
const betsBase = base('bets');
const playersBase = base('players');

export interface FilmRecord {
  imdb_id: string;
  name: string;
  nominations: string[];
  bets: string[];
  poster_url: string;
}

export interface BetRecord {
  player: string[];
  nomination: string[];
}

export const getCategories = async (): Promise<Category[]> => {
  const categories: Category[] = [];
  await categoriesBase.select().eachPage((categoriesResult, fetchNextPage) => {
    categoriesResult.forEach((category, index) => {
      const previousCategory =
        index === 0 ? null : categoriesResult[index - 1].get('slug');
      const nextCategory =
        index === categoriesResult.length - 1
          ? null
          : categoriesResult[index + 1].get('slug');
      categories.push(formatCategory(category, previousCategory, nextCategory));
    });

    fetchNextPage();
  });

  return categories;
};

export const getCategory = async (slug: string): Promise<Category> => {
  const categories = await getCategories();
  const category = categories.find((category) => category.slug === slug);

  return { ...category };
};

const formatCategory = (
  categoryResponse: AirtableRecord,
  previousCategory: string,
  nextCategory: string
): Category => ({
  id: categoryResponse.id,
  slug: categoryResponse.get('slug'),
  name: categoryResponse.get('name'),
  nominations: categoryResponse.get('nominations') ?? null,
  previousCategory: previousCategory,
  nextCategory: nextCategory
});

export const getNominations = async (
  nominationIds: string[]
): Promise<Nomination[]> => {
  const query = `OR(${nominationIds
    .map((id) => `RECORD_ID() = '${id}'`)
    .join(',')})
    `;

  const nominations: Nomination[] = [];
  await nominationsBase
    .select({ filterByFormula: query })
    .eachPage((nominationsResult, fetchNextPage) => {
      nominationsResult.forEach((nomination, index) => {
        nominations.push(formatNomination(nomination));
      });

      fetchNextPage();
    });

  return nominations;
};

const formatNomination = (nominationResponse: AirtableRecord): Nomination => ({
  id: nominationResponse.id,
  year: nominationResponse.get('year'),
  category: nominationResponse.get('category')[0],
  film: nominationResponse.get('film')[0],
  nominee: nominationResponse.get('nominee') ?? null,
  won: !!nominationResponse.get('won'),
  bets: nominationResponse.get('bets') ?? null,
  decided: null
});

export const getFilms = async (filmIds: string[]): Promise<Film[]> => {
  const query = `OR(${filmIds.map((id) => `RECORD_ID() = '${id}'`).join(',')})
    `;
  const films: Film[] = [];
  await filmsBase
    .select({ filterByFormula: query })
    .eachPage((filmsResult, fetchNextPage) => {
      filmsResult.forEach((film) => {
        films.push(formatFilm(film));
      });

      fetchNextPage();
    });

  return films;
};

export const updateFilm = async (
  filmId: string,
  film: Partial<FilmRecord>
): Promise<Film> => {
  console.log(
    `Updating film:\n${JSON.stringify({ filmId, ...film }, null, 2)}`
  );
  return new Promise((resolve, reject) => {
    filmsBase
      .update(filmId, film)
      .then((result) => resolve(formatFilm(result)))
      .catch((error) => {
        reject(error);
        console.error(error);
      });
  });
};

export const setFilmPoster = async (
  filmId: string,
  poster: string
): Promise<Film> => {
  return updateFilm(filmId, { poster_url: poster });
};

const formatFilm = (filmResponse: AirtableRecord): Film => ({
  id: filmResponse.id,
  imdbId: filmResponse.get('imdb_id'),
  name: filmResponse.get('name'),
  poster: filmResponse.get('poster_url') ?? null
});

export const getBets = async (betIds: string[]): Promise<Bet[]> => {
  const query = `OR(${betIds.map((id) => `RECORD_ID() = '${id}'`).join(',')})
    `;
  const bets: Bet[] = [];
  await betsBase
    .select({ filterByFormula: query })
    .eachPage((betsResult, fetchNextPage) => {
      betsResult.forEach((bet) => {
        bets.push(formatBet(bet));
      });

      fetchNextPage();
    });

  return bets;
};

export const createBet = async (bet: BetRecord): Promise<Bet> => {
  console.log(`Creating bet:\n${JSON.stringify(bet, null, 2)}`);
  return new Promise((resolve, reject) => {
    betsBase
      .create(bet)
      .then((result) => resolve(formatBet(result)))
      .catch((error) => {
        reject(error);
        console.error(error);
      });
  });
};

export const updateBet = async (
  betId: string,
  nominationId: string
): Promise<Bet> => {
  console.log(
    `Updating bet:\n${JSON.stringify({ betId, nominationId }, null, 2)}`
  );
  return new Promise((resolve, reject) => {
    betsBase
      .update(betId, { nomination: [nominationId] })
      .then((result) => resolve(formatBet(result)))
      .catch((error) => {
        reject(error);
        console.error(error);
      });
  });
};

export const getBetsForPlayer = async (
  playerId: string
): Promise<Record<string, string>> => {
  const player = await getPlayers([playerId]);
  const bets = await getBets(player[0].bets);
  const nominationBets: Record<string, string> = {};
  bets.forEach((bet) => (nominationBets[bet.nomination] = bet.id));

  return nominationBets;
};

const formatBet = (betResponse: AirtableRecord): Bet => ({
  id: betResponse.id,
  player: betResponse.get('player')[0],
  nomination: betResponse.get('nomination')[0]
});

export const getPlayers = async (playerIds: string[]): Promise<Player[]> => {
  const params = playerIds
    ? {
        filterByFormula: `OR(${playerIds
          .map((id) => `RECORD_ID() = '${id}'`)
          .join(',')})`
      }
    : {};
  const players: Player[] = [];
  await playersBase.select(params).eachPage((playersResult, fetchNextPage) => {
    playersResult.forEach((player) => {
      players.push(formatPlayer(player));
    });

    fetchNextPage();
  });

  return players;
};

const formatPlayer = (playerResponse: AirtableRecord): Player => ({
  id: playerResponse.id,
  name: playerResponse.get('name'),
  correct: 0,
  bets: playerResponse.get('bets') ?? null
});
