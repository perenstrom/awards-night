import { Film } from '@prisma/client';

export const getFilmsResponseFixture = (year: number): Film[] => {
  const films: Record<number, Film[]> = {
    2020: [
      {
        imdbId: 'tt3224458',
        name: 'A Beautiful Day in the Neighborhood',
        releaseDate: null,
        posterUrl:
          'https://image.tmdb.org/t/p/w342/p9vCAVhDK375XyobVcKqzqzsUHE.jpg'
      },
      {
        imdbId: 'tt7131622',
        name: 'Once Upon a Time… in Hollywood',
        releaseDate: null,
        posterUrl:
          'https://image.tmdb.org/t/p/w342/8j58iEBw9pOXFD2L0nt0ZXeHviB.jpg'
      },
      {
        imdbId: 'tt8579674',
        name: '1917',
        releaseDate: null,
        posterUrl:
          'https://image.tmdb.org/t/p/w342/iZf0KyrE25z1sage4SYFLCCrMi9.jpg'
      },
      {
        imdbId: 'tt6394270',
        name: 'Bombshell',
        releaseDate: null,
        posterUrl:
          'https://image.tmdb.org/t/p/w342/gbPfvwBqbiHpQkYZQvVwB6MVauV.jpg'
      }
    ],
    2021: [
      {
        imdbId: 'tt9770150',
        name: 'Nomadland',
        releaseDate: null,
        posterUrl:
          'https://image.tmdb.org/t/p/w342/fmHBjfiMb7cP0cikF17LoA8E1bp.jpg'
      },
      {
        imdbId: 'tt10618286',
        name: 'Mank',
        releaseDate: null,
        posterUrl:
          'https://image.tmdb.org/t/p/w342/1VF9IcI4Vyrd2oYrVp0oNuPeE70.jpg'
      },
      {
        imdbId: 'tt13143964',
        name: 'Borat Subsequent Moviefilm',
        releaseDate: null,
        posterUrl:
          'https://image.tmdb.org/t/p/w342/kwh9dYvZLn7yJ9nfU5sPj2h9O7l.jpg'
      },
      {
        imdbId: 'tt10706602',
        name: 'Collective',
        releaseDate: null,
        posterUrl:
          'https://image.tmdb.org/t/p/w342/oR93n0CAn2GznyHDFSRTp0J1t8c.jpg'
      }
    ]
  };

  return films[year];
};
