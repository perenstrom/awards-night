export const getPlayersResponse = (players?) => {
  const response = {
    records: [
      {
        id: 'player-1',
        fields: {
          bets: ['bet-1', 'bet-3', 'bet-5'],
          name: 'Player 1',
          id: 1
        },
        createdTime: '2021-03-29T18:11:09.000Z'
      },
      {
        id: 'player-2',
        fields: {
          bets: ['bet-2', 'bet-4', 'bet-6'],
          name: 'Player 2',
          id: 2
        },
        createdTime: '2021-03-29T18:11:09.000Z'
      }
    ]
  };

  if (players) {
    return {
      records: response.records.filter((record) => players.includes(record.id))
    };
  } else {
    return response;
  }
};
