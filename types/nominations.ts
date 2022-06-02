export interface Year {
  year: number;
  name: string;
  date: string;
  bettingOpen: boolean;
  categories: string[];
  nominations: number[];
}

export type NormalizedYears = Record<number, Year>;

export interface Nomination {
  id: number;
  year: number;
  category: string;
  won: boolean;
  film: string;
  nominee: string;
  decided: boolean;
}

export type NormalizedNominations = Record<number, Nomination>;

// Record<NominationId, BetId[]>
export type NominationBets = Record<number, number[]>;

export interface Category {
  slug: string;
  name: string;
  nominations: number[];
  previousCategory: string | null;
  nextCategory: string | null;
}

export type NormalizedCategories = Record<string, Category>;

interface BaseFilm {
  name: string;
  poster: string;
  releaseDate?: string;
}
export interface Film extends BaseFilm {
  imdbId: string;
}
export type ExternalFilm = Omit<Film, 'id'>;
export interface TmdbFilmResult extends BaseFilm {
  tmdbId: number;
}

export type NormalizedFilms = Record<string, Film>;

export interface Bet {
  id: number;
  player: number;
  nomination: number;
}

export type NormalizedBets = Record<number, Bet>;

export interface Player {
  id: number;
  name: string;
  correct: number;
  bets: number[];
  group?: number | null;
  auth0UserId?: string | null;
}

export type NormalizedPlayers = Record<number, Player>;

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
  bets: Bet[];
  players: Player[];
  nominationBets: NominationBets;
}
