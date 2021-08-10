import {
  getCategories,
  getFilms,
  getNominations,
  getYear,
  setFilmPoster
} from 'services/airtable';
import { getPoster } from 'services/tmdb';
import {
  NormalizedCategories,
  NormalizedFilms,
  NormalizedNominations,
  Year,
  CategoryId,
  NominationData,
  Nomination
} from 'types/nominations';
import { calculateCompletedCategories } from 'utils/nominations';

export const getNominationData = async (
  year: number
): Promise<NominationData> => {
  try {
    const yearData = await getYear(year);

    const categories = await getCategories(yearData.categories);
    const normalizedCategories: NormalizedCategories = {};
    const categoryIdToSlug: Record<CategoryId, string> = {};
    categories.forEach((c) => {
      normalizedCategories[c.slug] = c;
      categoryIdToSlug[c.id] = c.slug;
    });

    const nominations = await getNominations(yearData.nominations);

    const formatNomination = (bettingOpen: boolean, nomination: Nomination) => {
      if (!bettingOpen) {
        return { ...nomination, bets: nomination.bets ?? [] };
      } else {
        return { ...nomination, bets: [] } as Nomination;
      }
    };

    const normalizedNominations: NormalizedNominations = {};
    nominations.forEach((n) => {
      normalizedNominations[n.id] = formatNomination(yearData.bettingOpen, n);
      normalizedCategories[categoryIdToSlug[n.category]].nominations.push(n.id);
    });

    const films = await getFilms(nominations.map((n) => n.film));
    films.forEach(async (f) => {
      if (!f.poster) {
        const poster = await getPoster(f.imdbId);
        await setFilmPoster(f.id, poster);
        f.poster = poster;
      }
    });
    const normalizedFilms: NormalizedFilms = {};
    films.forEach((f) => (normalizedFilms[f.id] = f));

    const meta = {
      completedCategories: calculateCompletedCategories(
        Object.values(normalizedCategories),
        normalizedNominations
      )
    };

    return {
      year: yearData,
      categories: normalizedCategories,
      films: normalizedFilms,
      nominations: normalizedNominations,
      meta: meta
    };
  } catch (error) {
    console.log(error);
  }
};

export const refreshNominations = async (
  year: Year
): Promise<NormalizedNominations> => {
  const nominations = await getNominations(year.nominations);

  const normalizedNominations: NormalizedNominations = {};
  nominations.forEach((n) => (normalizedNominations[n.id] = n));

  return normalizedNominations;
};
