export interface Nomination {
  id: string;
  year: number;
  category: Category;
  won: boolean;
  film: string;
  nominee: string;
  bets: string[];
}

export type NormalizedNominations = Record<string, Nomination>

export interface Category {
  id: string;
  slug: string;
  name: string;
  nominations: string[];
  bets: string[];
  previousCategory: string;
  nextCategory: string;
}

export type NormalizedCategories = Record<string, Category>

export interface Film {
  id: string;
  imdbId: string;
  name: string;
  poster: string;
}

export type NormalizedFilms = Record<string, Film>;

export interface Bet {
  id: string;
  player: string;
  nomination: string;
}

export type NormalizedBets = Record<string, Bet>;

export interface Player {
  id: string;
  name: string;
  correct: number;
}

export type NormalizedPlayers = Record<string, Player>;

export interface CategoryData {
  categories: NormalizedCategories;
  nominations: NormalizedNominations;
  films: NormalizedFilms;
  bets: NormalizedBets;
  players: NormalizedPlayers;
  status: Status;
}

export interface Status {
  completedCategories: number;
}