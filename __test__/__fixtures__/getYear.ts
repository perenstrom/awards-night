import { CategoryId, NominationId, Year, YearId } from 'types/nominations';

export const getYear = (): Year => ({
  id: 'abcdef' as YearId,
  name: '93rd Academy Awards',
  year: 2021,
  date: new Date('2021-04-25T22:00:00.000Z'),
  bettingOpen: true,
  categories: [
    'recvG2nEkvaGLyms6' as CategoryId,
    'recSeaEdlRp3qdXgX' as CategoryId
  ],
  nominations: [
    'rec1XIDv6jB3p3GrE' as NominationId,
    'rec2OmINmcMBMy66b' as NominationId,
    'rec2atr9tpHP6AzlM' as NominationId
  ]
});
