export interface Nomination {
  id: string;
  year: number;
  category: Category;
  won: boolean;
  film: string;
  nominee: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  nominations: string[];
  bets: string[];
}

export interface Film {
  id: string;
  imdbId: string;
  name: string;
}

export type NormalizedFilms = Record<string, Film>;
