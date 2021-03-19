export interface Nomination {
  id: string;
  year: number;
  category: Category;
  won: boolean;
  film: string;
  nominee: string;
  bets: string[];
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  nominations: string[];
  bets: string[];
  previousCategory: string;
  nextCategory: string;
}

export interface Film {
  id: string;
  imdbId: string;
  name: string;
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
}

export type NormalizedPlayers = Record<string, Player>;