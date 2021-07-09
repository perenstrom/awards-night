export const getYearsResponse = (years?) => {
  const response = {
    records: [
      {
        id: '2020-id',
        fields: {
          name: '92rd Academy Awards',
          year: 2020,
          date: '2020-04-25T22:00:00.000Z',
          betting_open: true,
          categories: ['best-adapted-screenplay-id', 'best-picture-id'],
          nominations: [
            'nomination-2020-best-adapted-screenplay-1',
            'nomination-2020-best-adapted-screenplay-2',
            'nomination-2020-best-picture-1',
            'nomination-2020-best-picture-2'
          ]
        }
      },
      {
        id: '2021-id',
        fields: {
          name: '93rd Academy Awards',
          year: 2021,
          date: '2021-04-25T22:00:00.000Z',
          betting_open: false,
          categories: ['best-animated-short-id', 'best-picture-id'],
          nominations: [
            'nomination-2021-best-animated-short-1',
            'nomination-2021-best-animated-short-2',
            'nomination-2021-best-picture-1',
            'nomination-2021-best-picture-2'
          ]
        }
      }
    ]
  };

  if (years) {
    return {
      records: response.records.filter((record) =>
        years.includes(record.fields.year.toString())
      )
    };
  } else {
    return response;
  }
};
