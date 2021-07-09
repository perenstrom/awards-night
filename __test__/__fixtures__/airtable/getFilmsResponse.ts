export const getFilmsResponse = (films?: string[]) => {
  const response = {
    records: [
      {
        id: 'citizen-kane',
        fields: {
          poster_url: 'http://image.tmdb.org/t/p/w342/citizen-kane.jpg',
          nominations: ['nomination-2020-best-adapted-screenplay-1'],
          name: 'Citizen Kane',
          imdb_id: 'imdb-ck'
        },
        createdTime: '2021-03-15T15:20:47.000Z'
      },
      {
        id: 'moana',
        fields: {
          poster_url: 'http://image.tmdb.org/t/p/w342/moana.jpg',
          nominations: ['nomination-2020-best-adapted-screenplay-2'],
          name: 'Moana',
          imdb_id: 'imdb-m'
        },
        createdTime: '2021-03-15T15:19:54.000Z'
      },
      {
        id: 'failsafe',
        fields: {
          poster_url: 'http://image.tmdb.org/t/p/w342/failsafe.jpg',
          nominations: ['nomination-2021-best-animated-short-1'],
          name: 'Failsafe',
          imdb_id: 'imdb-fs'
        },
        createdTime: '2021-03-15T15:22:08.000Z'
      },
      {
        id: 'twelve-angry-men',
        fields: {
          poster_url: 'http://image.tmdb.org/t/p/w342/twelve-angry-men.jpg',
          nominations: ['nomination-2021-best-animated-short-2'],
          name: 'Twelve Angry Men',
          imdb_id: 'imdb-tam'
        },
        createdTime: '2021-03-15T15:21:54.000Z'
      },
      {
        id: 'the-matrix',
        fields: {
          poster_url: 'http://image.tmdb.org/t/p/w342/the-matrix.jpg',
          nominations: ['nomination-2020-best-picture-1'],
          name: 'The Matrix',
          imdb_id: 'imdb-tm'
        },
        createdTime: '2021-03-15T15:19:03.000Z'
      },
      {
        id: 'bridget-jones',
        fields: {
          poster_url: 'http://image.tmdb.org/t/p/w342/bridget-jones.jpg',
          nominations: ['nomination-2020-best-picture-2'],
          name: 'Bridget Jones',
          imdb_id: 'imdb-bj'
        },
        createdTime: '2021-03-15T15:22:55.000Z'
      },
      {
        id: 'legally-blond',
        fields: {
          poster_url: 'http://image.tmdb.org/t/p/w342/legally-blond.jpg',
          nominations: ['nomination-2021-best-picture-1'],
          name: 'Legally Blond',
          imdb_id: 'imdb-lb'
        },
        createdTime: '2021-03-15T15:18:05.000Z'
      },
      {
        id: 'legally-blond-2',
        fields: {
          poster_url: 'http://image.tmdb.org/t/p/w342/legally-blond-2.jpg',
          nominations: ['nomination-2021-best-picture-2'],
          name: 'Legally Blond 2',
          imdb_id: 'imdb-lb2'
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
