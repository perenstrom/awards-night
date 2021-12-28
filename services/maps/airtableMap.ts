import AirtableRecord from 'airtable/lib/record';
import {
  BetRecord,
  FilmRecord,
  NominationRecord,
  YearRecord
} from 'services/airtable/airtable.types';
import {
  Bet,
  BetId,
  Category,
  CategoryId,
  Film,
  FilmId,
  Nomination,
  NominationBets,
  NominationId,
  Player,
  PlayerId,
  Year,
  YearId
} from 'types/nominations';

export const airtableMap = {
  year: {
    toAirtable: (year: Partial<Year>): YearRecord => ({
      year: year.year,
      name: year.name,
      date: year.date,
      betting_open: year.bettingOpen,
      categories: year.categories,
      nominations: year.nominations
    }),
    fromAirtable: (yearResponse: AirtableRecord): Year => ({
      id: yearResponse.id as YearId,
      year: yearResponse.get('year'),
      name: yearResponse.get('name'),
      date: yearResponse.get('date'),
      bettingOpen: !!yearResponse.get('betting_open'),
      categories: yearResponse.get('categories') ?? [],
      nominations: yearResponse.get('nominations') ?? []
    })
  },
  category: {
    fromAirtable: (categoryResponse: AirtableRecord): Category => ({
      id: categoryResponse.id as CategoryId,
      slug: categoryResponse.get('slug'),
      name: categoryResponse.get('name'),
      nominations: [],
      previousCategory: null,
      nextCategory: null
    })
  },
  nomination: {
    toAirtable: (nomination: Partial<Nomination>): NominationRecord => ({
      year: nomination.year && [nomination.year],
      category: nomination.category && [nomination.category],
      film: nomination.category && [nomination.film],
      nominee: nomination.nominee,
      won: nomination.won,
      decided: nomination.decided
    }),
    fromAirtable: (nominationResponse: AirtableRecord): Nomination => ({
      id: nominationResponse.id as NominationId,
      year: nominationResponse.get('year')[0],
      category: nominationResponse.get('category')[0],
      film: nominationResponse.get('film')[0],
      nominee: nominationResponse.get('nominee') ?? null,
      won: !!nominationResponse.get('won'),
      decided: !!nominationResponse.get('decided')
    })
  },
  nominationBets: {
    fromAirtable: (nominationResponse: AirtableRecord): NominationBets => ({
      [nominationResponse.id as NominationId]:
        nominationResponse.get('bets') ?? []
    })
  },
  film: {
    toAirtable: (film: Partial<Film>): FilmRecord => ({
      imdb_id: film.imdbId,
      name: film.name,
      poster_url: film.poster
    }),
    fromAirtable: (filmResponse: AirtableRecord): Film => ({
      id: filmResponse.id as FilmId,
      imdbId: filmResponse.get('imdb_id'),
      name: filmResponse.get('name'),
      poster: filmResponse.get('poster_url') ?? null,
      releaseDate: filmResponse.get('release_date') ?? null
    })
  },
  bet: {
    toAirtable: (bet: Partial<Bet>): BetRecord => ({
      nomination: [bet.nomination],
      player: bet.player ? [bet.player] : undefined
    }),
    fromAirtable: (betResponse: AirtableRecord): Bet => ({
      id: betResponse.id as BetId,
      player: betResponse.get('player')[0],
      nomination: betResponse.get('nomination')[0]
    })
  },
  player: {
    fromAirtable: (playerResponse: AirtableRecord): Player => ({
      id: playerResponse.id as PlayerId,
      name: playerResponse.get('name'),
      correct: 0,
      bets: playerResponse.get('bets') ?? null,
      group: playerResponse.get('group_id')?.[0] ?? null
    })
  }
};
