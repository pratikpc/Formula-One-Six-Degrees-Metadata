# [Deprecated] Extract DRIVER PAIRS

# [This Library has been moved to formula-one-six-degrees-metadata]

## Website [https://pratikpc.github.io/six-degree-f1/](https://pratikpc.github.io/six-degree-f1/)


Extracts Driver Pairs, Generates them and Stores them for you to utilise [from this URL](https://fiaresultsandstatistics.motorsportstats.com/)

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
} from 'formula1-extract-driver-pairs';
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