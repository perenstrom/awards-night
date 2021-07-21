import Airtable from 'airtable';
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
import { PartialBy } from 'types/utilityTypes';
import { arrayChunk } from 'utils/arrayChunk';
import { NominationRecord } from './airtable.types';
import { airtableMap } from './maps/airtableMap';

const base = new Airtable().base(process.env.AIRTABLE_DATABASE);
const yearsBase = base('years');
const categoriesBase = base('categories');
const nominationsBase = base('nominations');
const filmsBase = base('films');
const betsBase = base('bets');
const playersBase = base('players');

export const getYear = async (year: number): Promise<Year> => {
  const years: Year[] = [];
  await yearsBase
    .select({ filterByFormula: `year='${year}'` })
    .eachPage((yearsResult, fetchNextPage) => {
      yearsResult.forEach((year) => {
        years.push(airtableMap.year.fromAirtable(year));
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
      years.push(airtableMap.year.fromAirtable(year));
    });

    fetchNextPage();
  });

  return years;
};

export const updateYear = async (
  yearId: YearId,
  year: Partial<Year>
): Promise<Year> => {
  console.log(
    `Updating film:\n${JSON.stringify({ yearId, ...year }, null, 2)}`
  );

  return new Promise((resolve, reject) => {
    yearsBase
      .update(yearId, airtableMap.year.toAirtable(year))
      .then((result) => resolve(airtableMap.year.fromAirtable(result)))
      .catch((error) => {
        reject(error);
        console.error(error);
      });
  });
};

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
        categoriesResult.forEach((category) => {
          categories.push(airtableMap.category.fromAirtable(category));
        });

        fetchNextPage();
      });

    return addAdjacentCategories(categories);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const addAdjacentCategories = (categories: Category[]): Category[] => {
  return categories.map((category, index, categories) => {
    const previousCategory = index === 0 ? null : categories[index - 1].slug;
    const nextCategory =
      index === categories.length - 1 ? null : categories[index + 1].slug;
    return { ...category, previousCategory, nextCategory };
  });
};

export const createNominations = async (
  nominations: PartialBy<Nomination, 'id' | 'bets' | 'decided'>[]
): Promise<Nomination[]> => {
  console.log(`Creating nominations:\n${JSON.stringify(nominations, null, 2)}`);
  const nominationsChunks = arrayChunk(nominations, 10);

  return Promise.all<Nomination[]>(
    nominationsChunks.map(
      (nominations) =>
        new Promise((resolve, reject) => {
          nominationsBase
            .create(
              nominations.map((nomination) => ({
                fields: airtableMap.nomination.toAirtable(nomination)
              }))
            )
            .then((result) =>
              resolve(
                result.map((nominationResult) =>
                  airtableMap.nomination.fromAirtable(nominationResult)
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
        filterByFormula: `OR(${nominationIds
          .map((id) => `RECORD_ID()='${id}'`)
          .join(',')})
          `
      }
    : {};

  const nominations: Nomination[] = [];
  await nominationsBase
    .select(query)
    .eachPage((nominationsResult, fetchNextPage) => {
      nominationsResult.forEach((nomination, index) => {
        nominations.push(airtableMap.nomination.fromAirtable(nomination));
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
        nominations.push(airtableMap.nomination.fromAirtable(nomination));
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
      .then((result) => resolve(airtableMap.nomination.fromAirtable(result)))
      .catch((error) => {
        reject(error);
        console.error(error);
      });
  });
};

export const createFilm = async (
  film: PartialBy<Film, 'id'>
): Promise<Film> => {
  console.log(`Creating film:\n${JSON.stringify(film, null, 2)}`);
  return new Promise((resolve, reject) => {
    filmsBase
      .create(airtableMap.film.toAirtable(film))
      .then((result) => resolve(airtableMap.film.fromAirtable(result)))
      .catch((error) => {
        reject(error);
        console.error(error);
      });
  });
};

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
          films.push(airtableMap.film.fromAirtable(film));
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
        films.push(airtableMap.film.fromAirtable(film));
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

export const updateFilm = async (
  filmId: FilmId,
  film: Partial<Film>
): Promise<Film> => {
  console.log(
    `Updating film:\n${JSON.stringify({ filmId, ...film }, null, 2)}`
  );
  return new Promise((resolve, reject) => {
    filmsBase
      .update(filmId, airtableMap.film.toAirtable(film))
      .then((result) => resolve(airtableMap.film.fromAirtable(result)))
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
  return updateFilm(filmId, { poster });
};

export const createBet = async (bet: PartialBy<Bet, 'id'>): Promise<Bet> => {
  console.log(`Creating bet:\n${JSON.stringify(bet, null, 2)}`);
  return new Promise((resolve, reject) => {
    betsBase
      .create(airtableMap.bet.toAirtable(bet))
      .then((result) => resolve(airtableMap.bet.fromAirtable(result)))
      .catch((error) => {
        reject(error);
        console.error(error);
      });
  });
};

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
        bets.push(airtableMap.bet.fromAirtable(bet));
      });

      fetchNextPage();
    });

  return bets;
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

export const updateBet = async (
  betId: BetId,
  nominationId: NominationId
): Promise<Bet> => {
  console.log(
    `Updating bet:\n${JSON.stringify({ betId, nominationId }, null, 2)}`
  );
  return new Promise((resolve, reject) => {
    betsBase
      .update(betId, airtableMap.bet.toAirtable({ nomination: nominationId }))
      .then((result) => resolve(airtableMap.bet.fromAirtable(result)))
      .catch((error) => {
        reject(error);
        console.error(error);
      });
  });
};

export const deleteBet = async (betId: BetId): Promise<BetId> => {
  console.log(`Deleting bet:\n${JSON.stringify({ betId }, null, 2)}`);
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
      players.push(airtableMap.player.fromAirtable(player));
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
        players.push(airtableMap.player.fromAirtable(player));
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
