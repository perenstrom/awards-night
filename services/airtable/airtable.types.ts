import { CategoryId, FilmId, NominationId, PlayerId, YearId } from 'types/nominations';

export interface YearRecord {
  year: number;
  name: string;
  date: string;
  betting_open: boolean;
  categories: CategoryId[];
  nominations: NominationId[];
}

export interface NominationRecord {
  year: YearId[];
  category: CategoryId[];
  film: FilmId[];
  nominee: string;
  won: boolean;
}

export interface FilmRecord {
  imdb_id: string;
  name: string;
  poster_url: string;
}

export interface BetRecord {
  player: PlayerId[];
  nomination: NominationId[];
}