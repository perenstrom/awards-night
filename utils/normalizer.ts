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
  if (bets.length === 0) {
    return null;
  }

  const normalizedBets: NormalizedBets = {};

  bets.forEach((bet) => {
    normalizedBets[bet.id] = bet;
  });

  return normalizedBets;
};

export const normalizeNominations = (nominations: Nomination[]) => {
  if (nominations.length === 0) {
    return null;
  }

  const normalizedNominations: NormalizedNominations = {};

  nominations.forEach((nomination) => {
    normalizedNominations[nomination.id] = nomination;
  });

  return normalizedNominations;
};

export const normalizeFilms = (films: Film[]) => {
  if (films.length === 0) {
    return null;
  }

  const normalizedFilms: NormalizedFilms = {};

  films.forEach((film) => {
    normalizedFilms[film.imdbId] = film;
  });

  return normalizedFilms;
};

export const normalizePlayers = (players: Player[]) => {
  if (players.length === 0) {
    return null;
  }

  const normalizedPlayers: NormalizedPlayers = {};

  players.forEach((player) => {
    normalizedPlayers[player.id] = player;
  });

  return normalizedPlayers;
};

export const normalizeCategories = (categories: Category[]) => {
  if (categories.length === 0) {
    return null;
  }

  const normalizedCategories: NormalizedCategories = {};

  categories.forEach((category) => {
    normalizedCategories[category.slug] = category;
  });

  return normalizedCategories;
};
