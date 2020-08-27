# Formula One Six Degrees Metadata

## Website [https://pratikpc.github.io/six-degree-f1/](https://pratikpc.github.io/six-degree-f1/)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Extracts Driver Pairs, Distances Between Drivers, Generates them and Stores them for you to utilise in your JS or TS App [from this URL](https://fiaresultsandstatistics.motorsportstats.com/)

```ts
import {
   Drivers,
   TeamAndDriver,
   TeamMates,
   DriverIdAndNameLink,
   Distance,
   Path,
   TeamIdAndNameLink,
   TeamNamesAndDrivers
} from 'formula-one-six-degrees-metadata';
```

## Generate

```ts
const SEASONF = 1950;
const SEASONE = 2020;
const TEAM_DRIVER_HEADER = '._2xhp6';
const TEAM_DRIVER_TABLE_HEADER = 'Vv8Fg';
const ENTRY_LIST = 'h2._2Asch:contains("Entry List")';
```

Modify this variable in [lib/Run.ts]('./lib/run.ts') based on the HTML from FIA's website and then run `npm run build` and `npm run generate`
