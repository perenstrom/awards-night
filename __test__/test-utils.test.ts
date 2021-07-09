import {
  airtableFormulaToArray,
  extractAirtableFormulaFromSearch
} from './test-utils';

describe('airtableFormulaToArray', () => {
  it('returns correct array with multiple ids in OR', async () => {
    const airtableFormula = `OR(RECORD_ID()='bet-3',RECORD_ID()='bet-4',RECORD_ID()='bet-5',RECORD_ID()='bet-6')\n++++`;

    const airtableIdArray = airtableFormulaToArray(airtableFormula);

    const expectedArray = ['bet-3', 'bet-4', 'bet-5', 'bet-6'];
    expect(airtableIdArray).toEqual(expectedArray);
  });

  it('returns correct array with single id in OR', async () => {
    const airtableFormula = `OR(RECORD_ID()='bet-3')\n++++`;

    const airtableIdArray = airtableFormulaToArray(airtableFormula);

    const expectedArray = ['bet-3'];
    expect(airtableIdArray).toEqual(expectedArray);
  });

  it('returns correct array with empty OR', async () => {
    const airtableFormula = `OR()\n++++`;

    const airtableIdArray = airtableFormulaToArray(airtableFormula);

    const expectedArray = [];
    expect(airtableIdArray).toEqual(expectedArray);
  });

  it('returns correct array with single expression without or', async () => {
    const airtableFormula = `RECORD_ID()='bet-3'`;

    const airtableIdArray = airtableFormulaToArray(airtableFormula);

    const expectedArray = ['bet-3'];
    expect(airtableIdArray).toEqual(expectedArray);
  });

  it('returns correct array with single non Record ID expression', async () => {
    const airtableFormula = `year='2020'`;

    const airtableIdArray = airtableFormulaToArray(airtableFormula);

    const expectedArray = ['2020'];
    expect(airtableIdArray).toEqual(expectedArray);
  });
});

describe('extractAirtableFormulaFromSearch', () => {
  it('returns correct airtable formula when single parameter', async () => {
    const search =
      "?filterByFormula=OR(RECORD_ID()='bet-3',RECORD_ID()='bet-4',RECORD_ID()='bet-5',RECORD_ID()='bet-6')\n++++";

    const airtableFormula = extractAirtableFormulaFromSearch(search);

    const expectedFormula =
      "OR(RECORD_ID()='bet-3',RECORD_ID()='bet-4',RECORD_ID()='bet-5',RECORD_ID()='bet-6')";
    expect(airtableFormula).toEqual(expectedFormula);
  });

  it('returns correct airtable formula when multiple parameters', async () => {
    const search =
      "?otherParam=otherValue&filterByFormula=OR(RECORD_ID()='bet-3',RECORD_ID()='bet-4',RECORD_ID()='bet-5',RECORD_ID()='bet-6')\n++++";

    const airtableFormula = extractAirtableFormulaFromSearch(search);

    const expectedFormula =
      "OR(RECORD_ID()='bet-3',RECORD_ID()='bet-4',RECORD_ID()='bet-5',RECORD_ID()='bet-6')";
    expect(airtableFormula).toEqual(expectedFormula);
  });

  it('returns null when empty', async () => {
    const search = '';

    const airtableFormula = extractAirtableFormulaFromSearch(search);

    const expectedFormula = null;
    expect(airtableFormula).toEqual(expectedFormula);
  });

  it('returns null when parameter missing', async () => {
    const search = '?otherParam=otherValue';

    const airtableFormula = extractAirtableFormulaFromSearch(search);

    const expectedFormula = null;
    expect(airtableFormula).toEqual(expectedFormula);
  });
});
