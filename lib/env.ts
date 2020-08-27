import { join } from 'path';

export const URL =
   'https://fiaresultsandstatistics.motorsportstats.com/series/formula-one/season';

export const DATA_DIR = join(String(require.main?.path), '..', 'lib', 'data');
export const RESULTS_DIR = join(
   String(require.main?.path),
   '..',
   'lib',
   'results'
);
