import { arrayChunk } from "./arrayChunk";

describe('arrayChunk', () => {
  it('should throw when chunk size is 0', async () => {
    const testArray = [1,2,3,4];
    const functionCall = () => arrayChunk(testArray, 0);

    expect(functionCall).toThrow();
  });

  it('should return the original array if shorter than chunk size', async () => {
    const testArray = [1,2,3,4];
    const result = arrayChunk(testArray, 10);

    const expectedResult = [[1,2,3,4]]
    expect(result).toEqual(expectedResult);
  });

  it('should return the correct chunks if longer than chunk size', async () => {
    const testArray = [1,2,3,4,5,6,7,8];
    const result = arrayChunk(testArray, 3);

    const expectedResult = [[1,2,3], [4,5,6], [7,8]]
    expect(result).toEqual(expectedResult);
  });
});