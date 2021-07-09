import { server } from './__mocks__/mswServer';

export const mockRequests = () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
  afterAll(() => server.close());
  afterEach(() => server.resetHandlers());
  return server;
};

export const extractAirtableFormulaFromSearch = (
  decodedSearch: string
): string => {
  const filterByFormulaRegex = /filterByFormula=(.*)/;
  const match = decodedSearch.match(filterByFormulaRegex);

  if (match) {
    return decodedSearch.match(filterByFormulaRegex)[1];
  } else {
    return null;
  }
};

export const airtableFormulaToArray = (airtableFormula: string): string[] => {
  const extractRecordId = (input: string) => {
    const recordIdRegex = /RECORD_ID\(\)='(.*)'/;
    const otherRegex = /.+='(.+)'/;
    const recordIdMatch = input.match(recordIdRegex);

    if (recordIdMatch) {
      return recordIdMatch[1];
    } else {
      const otherMatch = input.match(otherRegex);
      if (otherMatch) {
        return otherMatch[1];
      } else {
        return null;
      }
    }
  };

  const orRegex = /OR\((.+)\)/;
  const orMatch = airtableFormula.match(orRegex);
  if (orMatch) {
    const orArguments = airtableFormula.match(orRegex)[1];
    const expressions = orArguments.split(',');

    const ids = expressions.map(extractRecordId);

    return ids;
  } else {
    const recordId = extractRecordId(airtableFormula);
    return recordId ? [extractRecordId(airtableFormula)] : [];
  }
};
