import mkdirp from 'mkdirp';
import { writeFile } from 'fs/promises';
import { join } from 'path';

import { DATA_DIR, RESULTS_DIR, SEASONF, SEASONE } from './env';
import ExtractDriverNamesMates from '.';

async function WriteFile(fileName: string, data: unknown) {
   return await writeFile(
      join(RESULTS_DIR, fileName),
      JSON.stringify(data, null, '\t'),
      'utf8'
   );
}
async function Run() {
   await mkdirp(DATA_DIR);
   await mkdirp(RESULTS_DIR);
   console.log('Loading And Pre Processing Started');
   const {
      driversNamesAndIdx,
      teamDrivers,
      teamMates
   } = await ExtractDriverNamesMates(SEASONF, SEASONE);
   console.log('Loading And Pre Processing Done');

   await WriteFile(`teamAndDriver.json`, teamDrivers);
   await WriteFile(`drivers.json`, driversNamesAndIdx);
   await WriteFile(`teamMates.json`, teamMates);
   return await writeFile(
      join(RESULTS_DIR, `index.ts`),
      `import drivers from './drivers.json';\nimport teamAndDriver from './teamAndDriver.json';\nimport teamMates from './teamMates.json';\nexport { drivers, teamAndDriver, teamMates };\n`,
      'utf8'
   );
   console.log('Results Written');
}

Run()
   .then(async () => {
      return console.log('Done', SEASONF, SEASONE);
   })
   .catch(err => {
      console.error(err, '333');
   });
