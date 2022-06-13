import {
  Bet,
  Category,
  Film,
  Nomination,
  NormalizedBets,
  NormalizedCategories,
  NormalizedFilms,
  NormalizedNominations,
  NormalizedPlayers,
  Player
} from 'types/nominations';

export const normalizeBets = (bets: Bet[]) => {
  const normalizedBets: NormalizedBets = {};

  bets.forEach((bet) => {
    normalizedBets[bet.id] = bet;
  });

  return normalizedBets;
};

export const normalizeNominations = (nominations: Nomination[]) => {
  const normalizedNominations: NormalizedNominations = {};

  nominations.forEach((nomination) => {
    normalizedNominations[nomination.id] = nomination;
  });

  return normalizedNominations;
};

export const normalizeFilms = (films: Film[]) => {
  const normalizedFilms: NormalizedFilms = {};

  films.forEach((film) => {
    normalizedFilms[film.imdbId] = film;
  });

  return normalizedFilms;
};

export const normalizePlayers = (players: Player[]) => {
  const normalizedPlayers: NormalizedPlayers = {};

  players.forEach((player) => {
    normalizedPlayers[player.id] = player;
  });

  return normalizedPlayers;
};

export const normalizeCategories = (categories: Category[]) => {
  const normalizedCategories: NormalizedCategories = {};

  categories.forEach((category) => {
    normalizedCategories[category.slug] = category;
  });

  return normalizedCategories;
};
