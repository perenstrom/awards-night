export const getPlayersResponse = (players?) => {
  const response = {
    records: [
      {
        id: 'player-1',
        fields: {
          bets: ['bet-1', 'bet-3', 'bet-5', 'bet-7'],
          name: 'Player 1',
          id: 1,
          group_id: ['group-1']
        },
        createdTime: '2021-03-29T18:11:09.000Z'
      },
      {
        id: 'player-2',
        fields: {
          bets: ['bet-2', 'bet-4', 'bet-6', 'bet-8'],
          name: 'Player 2',
          id: 2,
          group_id: ['group-1']
        },
        createdTime: '2021-03-29T18:11:09.000Z'
      },
      {
        id: 'player-3',
        fields: {
          bets: ['bet-9', 'bet-10'],
          name: 'Player 3',
          id: 3,
          group_id: ['group-2']
        },
        createdTime: '2021-03-29T18:11:09.000Z'
      },
      {
        id: 'player-4',
        fields: {
          bets: ['bet-11', 'bet-12'],
          name: 'Player 4',
          id: 4,
          group_id: ['group-2']
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
