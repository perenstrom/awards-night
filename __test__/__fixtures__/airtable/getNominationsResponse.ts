export const getNominationsResponse = (nominations?: string[]) => {
  const response = {
    records: [
      {
        id: 'nomination-2020-best-adapted-screenplay-1',
        fields: {
          film: ['citizen-kane'],
          category: ['best-adapted-screenplay-id'],
          year: ['2020-id'],
          id: 16
        },
        createdTime: '2021-03-15T15:36:17.000Z'
      },
      {
        id: 'nomination-2020-best-adapted-screenplay-2',
        fields: {
          film: ['moana'],
          category: ['best-adapted-screenplay-id'],
          year: ['2020-id'],
          id: 8
        },
        createdTime: '2021-03-15T15:32:59.000Z'
      },
      {
        id: 'nomination-2021-best-animated-short-1',
        fields: {
          film: ['failsafe'],
          category: ['best-animated-short-id'],
          year: ['2021-id'],
          id: 16
        },
        createdTime: '2021-03-15T15:36:17.000Z'
      },
      {
        id: 'nomination-2021-best-animated-short-2',
        fields: {
          film: ['twelve-angry-men'],
          category: ['best-animated-short-id'],
          year: ['2021-id'],
          id: 8
        },
        createdTime: '2021-03-15T15:32:59.000Z'
      },
      {
        id: 'nomination-2020-best-picture-1',
        fields: {
          film: ['the-matrix'],
          category: ['best-picture-id'],
          year: ['2020-id'],
          id: 16
        },
        createdTime: '2021-03-15T15:36:17.000Z'
      },
      {
        id: 'nomination-2020-best-picture-2',
        fields: {
          film: ['bridget-jones'],
          category: ['best-picture-id'],
          year: ['2020-id'],
          id: 8
        },
        createdTime: '2021-03-15T15:32:59.000Z'
      },
      {
        id: 'nomination-2021-best-picture-1',
        fields: {
          nominee: 'Vanessa Kirby',
          film: ['legally-blond'],
          category: ['best-picture-id'],
          year: ['2021-id'],
          id: 113
        },
        createdTime: '2021-03-15T15:51:34.000Z'
      },
      {
        id: 'nomination-2021-best-picture-2',
        fields: {
          nominee: 'Vanessa Kirby',
          film: ['legally-blond-2'],
          category: ['best-picture-id'],
          year: ['2021-id'],
          id: 113
        },
        createdTime: '2021-03-15T15:51:34.000Z'
      }
    ]
  };

  if (nominations) {
    return {
      records: response.records.filter((record) =>
        nominations.includes(record.id)
      )
    };
  } else {
    return response;
  }
};
