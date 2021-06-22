export const getCategoriesResponse = (categories?: string[]) => {
  const response = {
    records: [
      {
        id: 'best-adapted-screenplay-id',
        fields: {
          slug: 'best-adapted-screenplay',
          nominations: [
            'nomination-2020-best-adapted-screenplay-1',
            'nomination-2020-best-adapted-screenplay-2'
          ],
          years: ['2020-id'],
          name: 'Best Adapted Screenplay'
        },
        createdTime: '2021-03-14T21:21:27.000Z'
      },
      {
        id: 'best-animated-short-id',
        fields: {
          slug: 'best-animated-short',
          nominations: [
            'nomination-2021-best-animated-short-1',
            'nomination-2021-best-animated-short-2'
          ],
          years: ['2021-id'],
          name: 'Best Animated Short'
        },
        createdTime: '2021-03-14T21:30:46.000Z'
      },
      {
        id: 'best-picture-id',
        fields: {
          slug: 'best-picture',
          nominations: [
            'nomination-2020-best-picture-1',
            'nomination-2020-best-picture-2',
            'nomination-2021-best-picture-1',
            'nomination-2021-best-picture-2'
          ],
          years: ['2020-id', '2021-id'],
          name: 'Best Picture'
        },
        createdTime: '2021-03-14T20:29:43.000Z'
      }
    ]
  };

  if (categories) {
    return {
      records: response.records.filter((record) =>
        categories.includes(record.id)
      )
    };
  } else {
    return response;
  }
};
