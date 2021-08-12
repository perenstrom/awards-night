import Airtable from 'airtable';
export const base = new Airtable().base(process.env.AIRTABLE_DATABASE);