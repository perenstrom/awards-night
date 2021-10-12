export interface AddNominationsFields {
  year: string;
  category: string;
  nominationCount: string;
  films: string[];
  nominees: string[];
}

export interface AddFilmPostBody {
  action: 'addFilm';
  imdbId: string;
}

export interface SearchFilmsPostBody {
  action: 'searchFilms';
  filmQuery: string;
}

export interface AddNominationsPostBody extends AddNominationsFields {
  action: 'addNominations';
}

export interface ChangeNominationCountPostBody {
  action: 'changeNominationCount';
  nominationCount: string;
}

export type PostBody =
  | AddFilmPostBody
  | SearchFilmsPostBody
  | AddNominationsPostBody
  | ChangeNominationCountPostBody;
