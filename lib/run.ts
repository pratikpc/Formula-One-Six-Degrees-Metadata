import mkdirp from 'mkdirp';

import { DATA_DIR, RESULTS_DIR } from './env';

import ExtractDriverNamesMates from './Generator';
import Graph from './GraphFile';

const SEASONF = 1950;
const SEASONE = 2020;
const TEAM_DRIVER_HEADER = '._2xhp6';
const TEAM_DRIVER_TABLE_HEADER = 'Vv8Fg';
const ENTRY_LIST = 'h2._2Asch:contains("Entry List")';

async function Run() {
   await mkdirp(DATA_DIR);
   await mkdirp(RESULTS_DIR);
   console.log('Loading And Pre Processing Started');
   const {
      driversNamesAndIdx,
      teamDrivers,
      teamMates,
      driverIdAndNameLink,
      teamIdAndNameLink,
      teamNamesAndDrivers
   } = await ExtractDriverNamesMates(
      SEASONF,
      SEASONE,
      TEAM_DRIVER_TABLE_HEADER,
      TEAM_DRIVER_HEADER,
      ENTRY_LIST
   );

   const graph = new Graph(teamMates);
   await graph.AllPairShortestPath({ cache: true });
   console.log('Loading And Pre Processing Done');

   await Graph.WriteFile(`teamAndDriver.json`, teamDrivers);
   await Graph.WriteFile(`teamNamesAndDrivers.json`, teamNamesAndDrivers);
   await Graph.WriteFile(`drivers.json`, driversNamesAndIdx);
   await Graph.WriteFile(`teamMates.json`, teamMates);
   await Graph.WriteFile(`driverIdAndNameLink.json`, driverIdAndNameLink);
   await Graph.WriteFile(`teamIdAndNameLink.json`, teamIdAndNameLink);
   await Graph.WriteFile(
      `index.ts`,
      `import TeamNamesAndDrivers from './teamNamesAndDrivers.json';
import TeamIdAndNameLink from './teamIdAndNameLink.json';
import Drivers from './drivers.json';
import TeamAndDriver from './teamAndDriver.json';
import DriverIdAndNameLink from './driverIdAndNameLink.json';
import TeamMates from './teamMates.json';
import Distance from './distance.json';
import Path from './path.json';

export {
   Drivers,
   TeamAndDriver,
   TeamMates,
   DriverIdAndNameLink,
   Distance,
   Path,
   TeamIdAndNameLink,
   TeamNamesAndDrivers
};
`
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
