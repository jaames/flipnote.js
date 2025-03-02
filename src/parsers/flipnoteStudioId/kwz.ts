import { FlipnoteRegion } from '../types';
import { assert } from '../../utils';

/**
 * Match an FSID from Flipnote Studio 3D
 * e.g. 003f-0b7e-82a6-fe0bda
 * @internal
 */
const REGEX_KWZ_FSID = /^[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{6}$/; 

/**
 * Match an FSID from a DSi Library note (PPM to KWZ conversion)
 * e.g. 10b8-b909-5180-9b2013
 * @internal
 */
const REGEX_KWZ_DSI_LIBRARY_FSID = /^(00|10|12|14)[0-9a-f]{2}-[0-9a-f]{4}-[0-9a-f]{3}0-[0-9a-f]{4}[0159]{1}[0-9a-f]{1}$/; 

/**
 * KWZ equivalents of PPM_FSID_SPECIAL_CASE
 * @internal
 */
const KWZ_DSI_LIBRARY_FSID_SPECIAL_CASE_SUFFIX = [
  '5f-fc67-437a-cafa01',
  '2d-a4f9-e259-e9d603',
  'fa-8705-1645-04f803',
  '15-8900-e126-840604',
  'd5-d59f-19c8-3e2a09',
  'b8-41d4-1bba-568d0b',
  '0b-d95a-9b5c-c7610e',
  '35-3244-5ae3-94e414',
];

/**
 * Indicates whether the input is a valid Flipnote Studio 3D user ID
 */
export const isKwzFsid = (fsid: string) =>
  REGEX_KWZ_FSID.test(fsid);

/**
 * Indicates whether the input is a valid DSi Library user ID
 */
export const isKwzDsiLibraryFsid = (fsid: string) => {
  if (REGEX_KWZ_DSI_LIBRARY_FSID.test(fsid))
    return true;
  for (let suffix of KWZ_DSI_LIBRARY_FSID_SPECIAL_CASE_SUFFIX) {
    if (fsid.endsWith(suffix))
      return true;
  }
  return false;
};

/**
 * Get the region for any valid Flipnote Studio 3D user ID.
 * NOTE: This may be incorrect for IDs that are not from the DSi Library.
 */
export const getKwzFsidRegion = (fsid: string): FlipnoteRegion => {
  if (isKwzDsiLibraryFsid(fsid)) {
    switch (fsid.charAt(19)) {
      case '0':
      case '1':
        return FlipnoteRegion.JPN;
      case '5':
        return FlipnoteRegion.USA;
      case '9':
        return FlipnoteRegion.EUR;
      default:
        return FlipnoteRegion.UNKNOWN;
    }
  }
  return FlipnoteRegion.UNKNOWN;
};

/**
 * Format a hex string with dashes, to match the format used to display Flipnote Studio IDs in the app.
 */
export const kwzFsidFormat = (hex: string) => {
  return `${ hex.slice(0, 4) }-${ hex.slice(4, 8) }-${ hex.slice(8, 12) }-${hex.slice(12, 18)}`.toLowerCase();
};

/**
 * Unformat a Flipnote Studio ID string back into regular hex.
 */
export const kwzFsidUnformat = (fsid: string) => {
  return fsid.replace(/-/g, '').toUpperCase();
};