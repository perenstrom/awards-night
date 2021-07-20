export const arrayChunk = <T>(array: T[], chunkSize: number) => {
  if (chunkSize === 0) {
    throw 'Invalid chunk size';
  }

  const result: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }

  return result;
};
