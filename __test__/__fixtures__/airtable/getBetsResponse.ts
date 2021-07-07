export const getBetsResponse = (bets?) => {
  const response = {
    records: [
      {
        id: 'bet-1',
        fields: {
          id: 1,
          player: ['player-1'],
          nomination: ['nomination-2020-best-adapted-screenplay-1']
        },
        createdTime: '2021-03-22T13:16:20.000Z'
      },
      {
        id: 'bet-2',
        fields: {
          id: 2,
          player: ['player-2'],
          nomination: ['nomination-2020-best-adapted-screenplay-1']
        },
        createdTime: '2021-03-22T13:16:20.000Z'
      },
      {
        id: 'bet-3',
        fields: {
          id: 3,
          player: ['player-1'],
          nomination: ['nomination-2021-best-animated-short-1']
        },
        createdTime: '2021-03-22T13:16:20.000Z'
      },
      {
        id: 'bet-4',
        fields: {
          id: 4,
          player: ['player-2'],
          nomination: ['nomination-2021-best-animated-short-2']
        },
        createdTime: '2021-03-22T13:16:20.000Z'
      }
    ]
  };

  if (bets) {
    return {
      records: response.records.filter((record) => bets.includes(record.id))
    };
  } else {
    return response;
  }
};
