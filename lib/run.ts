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
      teamMates,
      driverIdAndNameLink
   } = await ExtractDriverNamesMates(SEASONF, SEASONE);
   console.log('Loading And Pre Processing Done');

   await WriteFile(`teamAndDriver.json`, teamDrivers);
   await WriteFile(`drivers.json`, driversNamesAndIdx);
   await WriteFile(`teamMates.json`, teamMates);
   await WriteFile(`driverIdAndNameLink.json`, driverIdAndNameLink);
   await writeFile(
      join(RESULTS_DIR, `index.ts`),
      `import Drivers from './drivers.json';\nimport TeamAndDriver from './teamAndDriver.json';\nimport DriverIdAndNameLink from './driverIdAndNameLink.json';\nimport TeamMates from './teamMates.json';\nexport { Drivers, TeamAndDriver, TeamMates, DriverIdAndNameLink };\n`,
      'utf8'
   );
   console.log('Results Written');
}

Run()
   .then(async () => {
      return console.log('Done', SEASONF, SEASONE);
   })
   .catch(err => {
      console.error(err);
   });
