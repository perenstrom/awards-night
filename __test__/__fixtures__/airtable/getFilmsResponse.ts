export const getFilmsResponse = (films?: string[]) => {
  const response = {
    records: [
      {
        id: 'citizen-kane',
        fields: {
          poster_url: 'http://image.tmdb.org/t/p/w342/citizen-kane.jpg',
          nominations: ['nomination-2020-best-adapted-screenplay-1'],
          name: 'Citizen Kane',
          imdb_id: 'imdb-ck',
          release_date: '1941-05-01'
        },
        createdTime: '2021-03-15T15:20:47.000Z'
      },
      {
        id: 'moana',
        fields: {
          poster_url: 'http://image.tmdb.org/t/p/w342/moana.jpg',
          nominations: ['nomination-2020-best-adapted-screenplay-2'],
          name: 'Moana',
          imdb_id: 'imdb-m',
          release_date: '2016-11-14'
        },
        createdTime: '2021-03-15T15:19:54.000Z'
      },
      {
        id: 'failsafe',
        fields: {
          poster_url: 'http://image.tmdb.org/t/p/w342/failsafe.jpg',
          nominations: ['nomination-2021-best-animated-short-1'],
          name: 'Failsafe',
          imdb_id: 'imdb-fs',
          release_date: '1964-09-15'
        },
        createdTime: '2021-03-15T15:22:08.000Z'
      },
      {
        id: 'twelve-angry-men',
        fields: {
          poster_url: 'http://image.tmdb.org/t/p/w342/twelve-angry-men.jpg',
          nominations: ['nomination-2021-best-animated-short-2'],
          name: 'Twelve Angry Men',
          imdb_id: 'imdb-tam',
          release_date: '1957-04-10'
        },
        createdTime: '2021-03-15T15:21:54.000Z'
      },
      {
        id: 'the-matrix',
        fields: {
          poster_url: 'http://image.tmdb.org/t/p/w342/the-matrix.jpg',
          nominations: ['nomination-2020-best-picture-1'],
          name: 'The Matrix',
          imdb_id: 'imdb-tm',
          release_date: '1999-03-24'
        },
        createdTime: '2021-03-15T15:19:03.000Z'
      },
      {
        id: 'bridget-jones',
        fields: {
          poster_url: 'http://image.tmdb.org/t/p/w342/bridget-jones.jpg',
          nominations: ['nomination-2020-best-picture-2'],
          name: 'Bridget Jones',
          imdb_id: 'imdb-bj',
          release_date: '2001-04-04'
        },
        createdTime: '2021-03-15T15:22:55.000Z'
      },
      {
        id: 'legally-blond',
        fields: {
          poster_url: 'http://image.tmdb.org/t/p/w342/legally-blond.jpg',
          nominations: ['nomination-2021-best-picture-1'],
          name: 'Legally Blond',
          imdb_id: 'imdb-lb',
          release_date: '2001-06-26'
        },
        createdTime: '2021-03-15T15:18:05.000Z'
      },
      {
        id: 'legally-blond-2',
        fields: {
          poster_url: 'http://image.tmdb.org/t/p/w342/legally-blond-2.jpg',
          nominations: ['nomination-2021-best-picture-2'],
          name: 'Legally Blond 2',
          imdb_id: 'imdb-lb2',
          release_date: '2003-06-30'
        },
        createdTime: '2021-03-15T15:28:39.000Z'
      }
    ]
  };

  if (films) {
    return {
      records: response.records.filter((record) => films.includes(record.id))
    };
  } else {
    return response;
  }
};
