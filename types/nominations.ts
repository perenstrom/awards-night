const YEAR_TYPE = Symbol();
export type YearId = string & { TYPE: typeof YEAR_TYPE };
export interface Year {
  id: YearId;
  year: number;
  name: string;
  date: string;
  bettingOpen: boolean;
  categories: CategoryId[];
  nominations: NominationId[];
}

export type NormalizedYears = Record<YearId, Year>;

const NOMINATION_TYPE = Symbol();
export type NominationId = string & { TYPE: typeof NOMINATION_TYPE };
export interface Nomination {
  id: NominationId;
  year: YearId;
  category: CategoryId;
  won: boolean;
  film: FilmId;
  nominee: string;
  decided: boolean;
}

export type NormalizedNominations = Record<NominationId, Nomination>;

export type NominationBets = Record<NominationId, BetId[]>;

const CATEGORY_TYPE = Symbol();
export type CategoryId = string & { TYPE: typeof CATEGORY_TYPE };
export interface Category {
  id: CategoryId;
  slug: string;
  name: string;
  nominations: NominationId[];
  previousCategory: string;
  nextCategory: string;
}

export type NormalizedCategories = Record<CategoryId, Category>;

const FILM_TYPE = Symbol();
export type FilmId = string & { TYPE: typeof FILM_TYPE };
interface BaseFilm {
  name: string;
  poster: string;
  releaseDate?: string;
}
export interface Film extends BaseFilm {
  id: FilmId;
  imdbId: string;
}
export type ExternalFilm = Omit<Film, 'id'>;
export interface TmdbFilmResult extends BaseFilm {
  tmdbId: number;
}

export type NormalizedFilms = Record<FilmId, Film>;

const BET_TYPE = Symbol();
export type BetId = string & { TYPE: typeof BET_TYPE };
export interface Bet {
  id: BetId;
  player: PlayerId;
  nomination: NominationId;
}

export type NormalizedBets = Record<BetId, Bet>;

const PLAYER_TYPE = Symbol();
export type PlayerId = string & { TYPE: typeof PLAYER_TYPE };
export interface Player {
  id: PlayerId;
  name: string;
  correct: number;
  bets: BetId[];
  group: GroupId;
}

export type NormalizedPlayers = Record<PlayerId, Player>;

const GROUP_TYPE = Symbol();
export type GroupId = string & { TYPE: typeof GROUP_TYPE };

export interface NominationMeta {
  completedCategories: number;
}

export interface NominationData {
  year: Year;
  categories: NormalizedCategories;
  nominations: NormalizedNominations;
  films: NormalizedFilms;
  meta: NominationMeta;
}

export interface BettingData {
  bets: NormalizedBets;
  players: NormalizedPlayers;
  nominationBets: NominationBets;
}
