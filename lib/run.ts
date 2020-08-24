import mkdirp from 'mkdirp';

import { DATA_DIR, RESULTS_DIR, SEASONF, SEASONE } from './env';
import ExtractDriverNamesMates from '.';
import Graph from './GraphFile';

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

   const graph = new Graph(teamMates);
   await graph.AllPairShortestPath({ cache: true });
   console.log('Loading And Pre Processing Done');

   await Graph.WriteFile(`teamAndDriver.json`, teamDrivers);
   await Graph.WriteFile(`drivers.json`, driversNamesAndIdx);
   await Graph.WriteFile(`teamMates.json`, teamMates);
   await Graph.WriteFile(`driverIdAndNameLink.json`, driverIdAndNameLink);
   await Graph.WriteFile(
      `index.ts`,
      `import Drivers from './drivers.json';\nimport TeamAndDriver from './teamAndDriver.json';\nimport DriverIdAndNameLink from './driverIdAndNameLink.json';\nimport TeamMates from './teamMates.json';\nimport Distance from './distance.json';\nimport Path from './path.json';\n\nexport { Drivers, TeamAndDriver, TeamMates, DriverIdAndNameLink, Distance, Path };\n`
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
