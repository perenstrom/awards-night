import Airtable from 'airtable';
import AirtableRecord from 'airtable/lib/record';
import {
  Bet,
  BetId,
  Category,
  CategoryId,
  Film,
  FilmId,
  Nomination,
  NominationId,
  Player,
  PlayerId,
  Year,
  YearId
} from 'types/nominations';
import { arrayChunk } from 'utils/arrayChunk';

const base = new Airtable().base(process.env.AIRTABLE_DATABASE);
const yearsBase = base('years');
const categoriesBase = base('categories');
const nominationsBase = base('nominations');
const filmsBase = base('films');
const betsBase = base('bets');
const playersBase = base('players');

export interface NominationRecord {
  year: YearId[];
  category: CategoryId[];
  film: FilmId[];
  nominee: string;
  won: boolean;
}

export interface FilmRecord {
  imdb_id: string;
  name: string;
  nominations: NominationId[];
  poster_url: string;
}

export interface BetRecord {
  player: PlayerId[];
  nomination: NominationId[];
}

export const getYear = async (year: number): Promise<Year> => {
  const years: Year[] = [];
  await yearsBase
    .select({ filterByFormula: `year='${year}'` })
    .eachPage((yearsResult, fetchNextPage) => {
      yearsResult.forEach((year) => {
        years.push(formatYear(year));
      });

      fetchNextPage();
    });

  if (years.length > 1) {
    throw new Error(`Multiple records with year ${year} found.`);
  } else if (years.length === 0) {
    return null;
  } else {
    return years[0];
  }
};

export const getYears = async (): Promise<Year[]> => {
  const years: Year[] = [];
  await yearsBase.select().eachPage((yearsResult, fetchNextPage) => {
    yearsResult.forEach((year) => {
      years.push(formatYear(year));
    });

    fetchNextPage();
  });

  return years;
};

const formatYear = (yearResponse: AirtableRecord): Year => ({
  id: yearResponse.id as YearId,
  year: yearResponse.get('year'),
  name: yearResponse.get('name'),
  date: yearResponse.get('date'),
  bettingOpen: !!yearResponse.get('betting_open'),
  categories: yearResponse.get('categories') ?? [],
  nominations: yearResponse.get('nominations') ?? []
});

export const getCategories = async (
  categoryIds?: CategoryId[]
): Promise<Category[]> => {
  const query = categoryIds
    ? {
        filterByFormula: `OR(${categoryIds
          .map((id) => `RECORD_ID()='${id}'`)
          .join(',')})
    `
      }
    : {};

  const categories: Category[] = [];
  try {
    await categoriesBase
      .select(query)
      .eachPage((categoriesResult, fetchNextPage) => {
        categoriesResult.forEach((category, index) => {
          const previousCategory =
            index === 0 ? null : categoriesResult[index - 1].get('slug');
          const nextCategory =
            index === categoriesResult.length - 1
              ? null
              : categoriesResult[index + 1].get('slug');
          categories.push(
            formatCategory(category, previousCategory, nextCategory)
          );
        });

        fetchNextPage();
      });

    return categories;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const formatCategory = (
  categoryResponse: AirtableRecord,
  previousCategory: string,
  nextCategory: string
): Category => ({
  id: categoryResponse.id as CategoryId,
  slug: categoryResponse.get('slug'),
  name: categoryResponse.get('name'),
  nominations: [],
  previousCategory: previousCategory,
  nextCategory: nextCategory
});

export const createNominations = async (
  nominations: NominationRecord[]
): Promise<Nomination[]> => {
  console.log(`Creating nominations:\n${JSON.stringify(nominations, null, 2)}`);
  const nominationsToAdd = nominations.map((nomination) => ({
    fields: nomination
  }));
  const nominationsChunks = arrayChunk(nominationsToAdd, 10);
  return Promise.all<Nomination[]>(
    nominationsChunks.map(
      (nominations) =>
        new Promise((resolve, reject) => {
          nominationsBase
            .create(nominations)
            .then((result) =>
              resolve(
                result.map((nominationResult) =>
                  formatNomination(nominationResult)
                )
              )
            )
            .catch((error) => {
              reject(error);
              console.error(error);
            });
        })
    )
  ).then((result) => result.flat());
};

export const getNominations = async (
  nominationIds?: NominationId[]
): Promise<Nomination[]> => {
  const query = nominationIds
    ? {
        filterByFormula: `AND()`
      }
    : {};

  const nominations: Nomination[] = [];
  await nominationsBase
    .select(query)
    .eachPage((nominationsResult, fetchNextPage) => {
      nominationsResult.forEach((nomination, index) => {
        nominations.push(formatNomination(nomination));
      });

      fetchNextPage();
    });

  return nominations;
};

export const getNominationsByCategoryAndYear = async (
  categorySlug: string,
  year: number
): Promise<Nomination[]> => {
  const query = {
    filterByFormula: `AND(FIND('${year}',ARRAYJOIN(year)),FIND('${categorySlug}',ARRAYJOIN(category)))`
  };

  const nominations: Nomination[] = [];
  await nominationsBase
    .select(query)
    .eachPage((nominationsResult, fetchNextPage) => {
      nominationsResult.forEach((nomination, index) => {
        nominations.push(formatNomination(nomination));
      });

      fetchNextPage();
    });

  return nominations;
};

export const updateNomination = async (
  nominationId: NominationId,
  nomination: Partial<NominationRecord>
): Promise<Nomination> => {
  console.log(
    `Updating nomination:\n${JSON.stringify(
      { nominationId, ...nomination },
      null,
      2
    )}`
  );

  return new Promise((resolve, reject) => {
    nominationsBase
      .update(nominationId, nomination)
      .then((result) => resolve(formatNomination(result)))
      .catch((error) => {
        reject(error);
        console.error(error);
      });
  });
};

const formatNomination = (nominationResponse: AirtableRecord): Nomination => ({
  id: nominationResponse.id as NominationId,
  year: nominationResponse.get('year')[0],
  category: nominationResponse.get('category')[0],
  film: nominationResponse.get('film')[0],
  nominee: nominationResponse.get('nominee') ?? null,
  won: !!nominationResponse.get('won'),
  bets: nominationResponse.get('bets') ?? null,
  decided: null
});

export const getFilms = async (filmIds?: FilmId[]): Promise<Film[]> => {
  const query = filmIds
    ? {
        filterByFormula: `OR(${filmIds
          .map((id) => `RECORD_ID()='${id}'`)
          .join(',')})`
      }
    : {};
  const films: Film[] = [];
  try {
    await filmsBase
      .select({ ...query, sort: [{ field: 'name', direction: 'asc' }] })
      .eachPage((filmsResult, fetchNextPage) => {
        filmsResult.forEach((film) => {
          films.push(formatFilm(film));
        });

        fetchNextPage();
      });
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
  return films;
};

export const getFilmByImdb = async (imdbId: string): Promise<Film> => {
  const query = `imdb_id='${imdbId}'`;
  const films: Film[] = [];

  await filmsBase
    .select({ filterByFormula: query })
    .eachPage((filmsResult, fetchNextPage) => {
      filmsResult.forEach((film) => {
        films.push(formatFilm(film));
      });

      fetchNextPage();
    });

  if (films.length > 1) {
    throw new Error(`Multiple records with imdb id ${imdbId} found.`);
  } else if (films.length === 0) {
    return null;
  } else {
    return films[0];
  }
};

export const createFilm = async (film: FilmRecord): Promise<Film> => {
  console.log(`Creating film:\n${JSON.stringify(film, null, 2)}`);
  return new Promise((resolve, reject) => {
    filmsBase
      .create(film)
      .then((result) => resolve(formatFilm(result)))
      .catch((error) => {
        reject(error);
        console.error(error);
      });
  });
};

export const updateFilm = async (
  filmId: FilmId,
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
  filmId: FilmId,
  poster: string
): Promise<Film> => {
  return updateFilm(filmId, { poster_url: poster });
};

const formatFilm = (filmResponse: AirtableRecord): Film => ({
  id: filmResponse.id as FilmId,
  imdbId: filmResponse.get('imdb_id'),
  name: filmResponse.get('name'),
  poster: filmResponse.get('poster_url') ?? null
});

export const getBets = async (betIds: BetId[]): Promise<Bet[]> => {
  if (betIds.length === 0) {
    return [];
  }

  const query = `OR(${betIds.map((id) => `RECORD_ID()='${id}'`).join(',')})
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
  betId: BetId,
  nominationId: NominationId
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

export const deleteBet = async (betId: BetId): Promise<BetId> => {
  console.log(`Updating bet:\n${JSON.stringify({ betId }, null, 2)}`);
  return new Promise((resolve, reject) => {
    betsBase
      .destroy(betId)
      .then((result) => resolve(result.id as BetId))
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
};

export const getBetsForPlayer = async (
  playerId: PlayerId
): Promise<Record<NominationId, BetId>> => {
  try {
    const player = await getPlayers([playerId]);
    const bets = await getBets(player[0].bets ?? []);
    const nominationBets: Record<NominationId, BetId> = {};
    bets.forEach((bet) => (nominationBets[bet.nomination] = bet.id));

    return nominationBets;
  } catch (error) {
    console.error(error);
    return {};
  }
};

const formatBet = (betResponse: AirtableRecord): Bet => ({
  id: betResponse.id as BetId,
  player: betResponse.get('player')[0],
  nomination: betResponse.get('nomination')[0]
});

export const getPlayers = async (playerIds: PlayerId[]): Promise<Player[]> => {
  const params = playerIds
    ? {
        filterByFormula: `OR(${playerIds
          .map((id) => `RECORD_ID()='${id}'`)
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

export const getPlayerByAuth0Id = async (auth0Id: string): Promise<Player> => {
  const players: Player[] = [];
  await playersBase
    .select({ filterByFormula: `auth0_user_id='${auth0Id}'` })
    .eachPage((playersResult, fetchNextPage) => {
      playersResult.forEach((player) => {
        players.push(formatPlayer(player));
      });

      fetchNextPage();
    });

  if (players.length > 1) {
    throw new Error(`Multiple records with id ${auth0Id} found.`);
  } else if (players.length === 0) {
    return null;
  } else {
    return players[0];
  }
};

const formatPlayer = (playerResponse: AirtableRecord): Player => ({
  id: playerResponse.id as PlayerId,
  name: playerResponse.get('name'),
  correct: 0,
  bets: playerResponse.get('bets') ?? null
});
