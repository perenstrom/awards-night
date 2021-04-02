type NominationId = string;
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

export type NormalizedNominations = Record<string, Nomination>

type CategoryId = string;
export interface Category {
  id: CategoryId;
  slug: string;
  name: string;
  nominations: NominationId[];
  previousCategory: string;
  nextCategory: string;
}

export type NormalizedCategories = Record<string, Category>

type FilmId = string;
export interface Film {
  id: FilmId;
  imdbId: string;
  name: string;
  poster: string;
}

export type NormalizedFilms = Record<string, Film>;

type BetId = string;
export interface Bet {
  id: BetId;
  player: string;
  nomination: NominationId;
}

export type NormalizedBets = Record<string, Bet>;

type PlayerId = string;
export interface Player {
  id: PlayerId;
  name: string;
  correct: number;
  bets: BetId[]
}

export type NormalizedPlayers = Record<string, Player>;

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