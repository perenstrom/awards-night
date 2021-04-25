const NOMINATION_TYPE = Symbol();
export type NominationId = string & {TYPE: typeof NOMINATION_TYPE};
export interface Nomination {
  id: NominationId;
  year: number;
  category: CategoryId;
  won: boolean;
  film: FilmId;
  nominee: string;
  bets: BetId[];
  decided: boolean;
}

export type NormalizedNominations = Record<NominationId, Nomination>

const CATEGORY_TYPE = Symbol();
export type CategoryId = string & {TYPE: typeof CATEGORY_TYPE};
export interface Category {
  id: CategoryId;
  slug: string;
  name: string;
  nominations: NominationId[];
  previousCategory: string;
  nextCategory: string;
}

export type NormalizedCategories = Record<CategoryId, Category>

const FILM_TYPE = Symbol();
export type FilmId = string & {TYPE: typeof FILM_TYPE};
export interface Film {
  id: FilmId;
  imdbId: string;
  name: string;
  poster: string;
}

export type NormalizedFilms = Record<FilmId, Film>;

const BET_TYPE = Symbol();
export type BetId = string & {TYPE: typeof BET_TYPE};
export interface Bet {
  id: BetId;
  player: PlayerId;
  nomination: NominationId;
}

export type NormalizedBets = Record<BetId, Bet>;

const PLAYER_TYPE = Symbol();
export type PlayerId = string & {TYPE: typeof PLAYER_TYPE};
export interface Player {
  id: PlayerId;
  name: string;
  correct: number;
  bets: BetId[]
}

export type NormalizedPlayers = Record<PlayerId, Player>;

export interface Status {
  completedCategories: number;
}

export interface CategoryData {
  categories: NormalizedCategories;
  nominations: NormalizedNominations;
  films: NormalizedFilms;
  bets: NormalizedBets;
  players: NormalizedPlayers;
  status: Status;
}

export interface NominationData {
  categories: Category[];
  nominations: NormalizedNominations;
  films: NormalizedFilms;
}