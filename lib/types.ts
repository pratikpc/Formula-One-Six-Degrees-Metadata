import type {
   Drivers,
   DriverIdAndNameLink,
   TeamAndDriver,
   TeamIdAndNameLink
} from './results';

export type DriversT = keyof typeof Drivers;
export type TeamAndDriverT = keyof typeof TeamAndDriver[0];
export type DriverLinkNameT = keyof typeof DriverIdAndNameLink;
export type TeamNameT = keyof typeof TeamIdAndNameLink;
