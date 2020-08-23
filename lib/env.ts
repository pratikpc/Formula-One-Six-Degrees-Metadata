import { join } from 'path';

export const URL =
   'https://fiaresultsandstatistics.motorsportstats.com/series/formula-one/season';
export const SEASONF = 1950;
export const SEASONE = 2020;
export const TEAM_DRIVER_HEADER = '._2xhp6';
export const TEAM_DRIVER_TABLE_HEADER = 'Vv8Fg';
export const ENTRY_LIST = 'h2._2Asch:contains("Entry List")';
export const DATA_DIR = join(String(require.main?.path), '..', 'lib', 'data');
export const RESULTS_DIR = join(
   String(require.main?.path),
   '..',
   'lib',
   'results'
);
