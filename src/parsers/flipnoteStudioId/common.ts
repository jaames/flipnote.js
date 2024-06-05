import { isPpmFsid, getPpmFsidRegion } from './ppm';
import { isKwzFsid, isKwzDsiLibraryFsid, getKwzFsidRegion } from './kwz';

import { FlipnoteRegion } from '../types';

/**
 * Indicates whether the input is a valid Flipnote Studio or Flipnote Studio 3D user ID
 */
export const isFsid = (fsid: string) => isPpmFsid(fsid) || isKwzFsid(fsid);

/**
 * Get the region for any valid Flipnote Studio or Flipnote Studio 3D user ID
 */
export const getFsidRegion = (fsid: string) => {
  if (isPpmFsid(fsid))
    return getPpmFsidRegion(fsid);
  else if (isKwzFsid(fsid))
    return getKwzFsidRegion(fsid);
  return FlipnoteRegion.UNKNOWN;
};

/**
 * Convert a PPM Flipnote Studio ID to the format used by KWZ Flipnote Studio IDs (as seen in Nintendo DSi Library Flipnotes).
 * Will return `null` if the conversion could not be made.
 * 
 * NOTE: KWZ Flipnote Studio IDs contain an extra two characters at the beginning. It is not possible to resolve these from a PPM Flipnote Studio ID.
 */
export const ppmFsidToKwzFsidSuffix = (fsid: string): string => {
  if (isPpmFsid(fsid)) {
    const a = fsid.slice(14, 16);
    const b = fsid.slice(12, 14);
    const c = fsid.slice(10, 12);
    const d = fsid.slice(8, 10);
    const e = fsid.slice(6, 8);
    const f = fsid.slice(4, 6);
    const g = fsid.slice(2, 4);
    const h = fsid.slice(0, 2);
    return `${ a }-${ b }${ c }-${ d }${ e }-${ f }${ g }${ h }`.toLocaleLowerCase();
  }
  return null;
};

/**
 * Convert a PPM Flipnote Studio ID to an array of all possible matching KWZ Flipnote Studio IDs (as seen in Nintendo DSi Library Flipnotes).
 * Will return `null` if the conversion could not be made.
 */
export const ppmFsidToPossibleKwzFsids = (fsid: string): string[] => {
  const kwzIdSuffix = ppmFsidToKwzFsidSuffix(fsid);
  if (kwzIdSuffix) {
    return [
      '00' + kwzIdSuffix,
      '10' + kwzIdSuffix,
      '12' + kwzIdSuffix,
      '14' + kwzIdSuffix,
    ];
  }
  return null;
};

/**
 * Convert a KWZ Flipnote Studio ID (from a Nintendo DSi Library Flipnote) to the format used by PPM Flipnote Studio IDs.
 * Will return `null` if the conversion could not be made.
 */
export const kwzFsidToPpmFsid = (fsid: string): string => {
  if (isKwzDsiLibraryFsid(fsid)) {
    const a = fsid.slice(19, 21);
    const b = fsid.slice(17, 19);
    const c = fsid.slice(15, 17);
    const d = fsid.slice(12, 14);
    const e = fsid.slice(10, 12);
    const f = fsid.slice(7, 9);
    const g = fsid.slice(5, 7);
    const h = fsid.slice(2, 4);
    return `${ a }${ b }${ c }${ d }${ e }${ f }${ g }${ h }`.toUpperCase();
  }
  return null;
};

/**
 * Tests if a KWZ Flipnote Studio ID (from a Nintendo DSi Library Flipnote) matches a given PPM-formatted Flipnote Studio ID.
 */
export const kwzFsidMatchesPpmFsid = (kwzFsid: string, ppmFsid: string): boolean =>
  kwzFsidToPpmFsid(kwzFsid) === ppmFsid;