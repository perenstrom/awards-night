export interface Nomination {
  id: number;
  year: number;
  category: Category;
  won: boolean;
  film: string;
  nominee: string;
}

export interface Category {
  id: number;
  name: string;
}
