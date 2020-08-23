import axios from 'axios';
import cheerio from 'cheerio';

import { existsSync } from 'fs';
import { writeFile, readFile } from 'fs/promises';
import path from 'path';

import {
   URL,
   TEAM_DRIVER_TABLE_HEADER,
   TEAM_DRIVER_HEADER,
   ENTRY_LIST,
   DATA_DIR
} from './env';

export async function Load(season: number) {
   const fileName = path.join(DATA_DIR, `${season}.html`);
   if (existsSync(fileName)) {
      return await readFile(fileName, 'utf8');
   }
   const url = `${URL}/${season}`;
   const html = await (await axios.get(url)).data;
   await writeFile(fileName, html, 'utf8');
   return html;
}

async function ProcessSeason(season: number) {
   const htmlText = await Load(season);
   const html = cheerio.load(htmlText);
   const teamDriverHeader = html(`.${TEAM_DRIVER_TABLE_HEADER}`)
      .has(ENTRY_LIST)
      .find(`${TEAM_DRIVER_HEADER}`)
      .toArray();
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const teamDrivers: any = {
      season: season
   };
   let teamCache: CheerioElement = teamDriverHeader[0]; // Just init
   for (const teamDriverHead of teamDriverHeader) {
      for (const teamDriver of teamDriverHead.children) {
         const team = teamDriver.firstChild.firstChild ?? teamCache;
         teamCache = team;
         const driver = teamDriver.lastChild.firstChild;
         if (
            team == null ||
            driver == null ||
            team.attribs.href == null ||
            driver.attribs.href == null
         )
            // eslint-disable-next-line no-continue
            continue;

         const teamDriverName = {
            team: team.attribs.href.split('/teams/')[1].split('/history')[0],
            driver: driver.attribs.href
               .split('/drivers/')[1]
               .split('/career')[0],
            driverName: driver.firstChild.data
         };
         if (teamDrivers[teamDriverName.team] == null)
            teamDrivers[teamDriverName.team] = new Set<string>();
         teamDrivers[teamDriverName.team].add(teamDriverName.driver);
      }
   }
   for (const key in teamDrivers)
      if (key !== 'season') teamDrivers[key] = Array.from(teamDrivers[key]);
   return teamDrivers;
}

export async function ProcessSeasons(start: number, end: number) {
   const teamsAndDrivers = [];
   for (let season = start; season <= end; season += 1) {
      // eslint-disable-next-line no-await-in-loop
      teamsAndDrivers.push(ProcessSeason(season));
   }
   return (await Promise.all(teamsAndDrivers)).flat();
}
export function ExtractDriversNamesAndIdx(
   teamDrivers: Record<string, string[]>[]
) {
   const driversSet = new Set<string>();
   for (const teamDriver of teamDrivers)
      for (const key in teamDriver)
         if (key !== 'season')
            teamDriver[key].forEach((driver: string) => driversSet.add(driver));
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const driversNamesAndIdx: any = { ...Array.from(driversSet).sort() };
   // eslint-disable-next-line guard-for-in
   for (const key in driversNamesAndIdx) {
      const newKey = driversNamesAndIdx[key];
      driversNamesAndIdx[newKey] = key;
   }
   return driversNamesAndIdx;
}
export function ExtractTeamMates(
   teamDrivers: Record<string, unknown>[],
   driversNamesAndIdx: Record<string, unknown>[]
) {
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const teamMates: any = {};
   // eslint-disable-next-line guard-for-in
   for (const key in driversNamesAndIdx) {
      // If the Number is Provided
      if (!Number.isNaN(key)) teamMates[key] = [];
   }
   for (const teamDriver of teamDrivers)
      for (const team in teamDriver)
         if (team !== 'season') {
            const teamMatesNames = teamDriver[team] as [];
            const teamMatesIdx = teamMatesNames.map(
               driver => driversNamesAndIdx[driver]
            );
            for (const driverIdx of teamMatesIdx) {
               const driverKey = String(driverIdx);
               teamMates[driverKey] = teamMates[driverKey].concat(teamMatesIdx);
            }
         }
   // eslint-disable-next-line guard-for-in
   for (const key in teamMates) {
      teamMates[key] = Array.from(new Set<string>(teamMates[key])).sort();
   }
   return teamMates;
}
export default async function ExtractDriverNamesMates(
   start: number,
   end: number
) {
   const teamDrivers = await ProcessSeasons(start, end);
   const driversNamesAndIdx = ExtractDriversNamesAndIdx(teamDrivers);
   const teamMates = ExtractTeamMates(teamDrivers, driversNamesAndIdx);
   return {
      teamDrivers: teamDrivers,
      driversNamesAndIdx: driversNamesAndIdx,
      teamMates: teamMates
   };
}

export {
   drivers as Drivers,
   teamAndDriver as TeamAndDriver,
   teamMates as TeamMates
} from './results';
