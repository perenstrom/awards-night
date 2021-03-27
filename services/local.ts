import { Bet } from 'types/nominations';

export const createBet = async (
  playerId: string,
  nominationId: string
): Promise<Bet> => {
  const url = '/api/bets';
  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body: JSON.stringify({
      playerId,
      nominationId
    })
  };

  return new Promise((resolve, reject) => {
    fetch(url, options)
      .then((response) => {
        if (response.status === 200) {
          resolve(response.json());
        } else {
          console.error(response.status);
          reject(response.status);
        }
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
};
