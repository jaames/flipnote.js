/**
 * Flipnote region
 */
export enum FlipnoteRegion {
  /** Europe and Oceania */
  EUR = 'EUR',
  /** Americas */
  USA = 'USA',
  /** Japan */
  JPN = 'JPN',
  /** Unidentified (possibly never used) */
  UNKNOWN = 'UNKNOWN'
};

/**
 * Match an FSID from Flipnote Studio
 * e.g. 1440D700CEF78DA8
 * @internal
 */
const REGEX_PPM_FSID = /^[0159]{1}[0-9A-F]{6}0[0-9A-F]{8}$/;

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
 * @internal
 * There are several known exceptions to the FSID format, all from Nintendo or Hatena developer and event accounts (mario, zelda 25th, etc).
 * This list was compiled from data provided by the Flipnote Archive, so it can be considered comprehensive enough to match any Flipnote you may encounter.
 */
const PPM_FSID_SPECIAL_CASE = [
  '01FACA7A4367FC5F',
  '03D6E959E2F9A42D', 
  '03F80445160587FA',
  '04068426E1008915',
  '092A3EC8199FD5D5',
  '0B8D56BA1BD441B8',
  '0E61C75C9B5AD90B',
  '14E494E35A443235'
];

/**
 * @internal
 */
const KWZ_DSI_LIBRARY_FSID_SPECIAL_CASE_SUFFIX = PPM_FSID_SPECIAL_CASE.map(id => convertPpmFsidToKwzFsidSuffix(id));

/**
 * Indicates whether the input is a valid Flipnote Studio user ID
 */
export function isPpmFsid(fsid: string) {
  return REGEX_PPM_FSID.test(fsid) || PPM_FSID_SPECIAL_CASE.includes(fsid);
}

/**
 * Indicates whether the input is a valid Flipnote Studio 3D user ID
 */
export function isKwzFsid(fsid: string) {
  return REGEX_KWZ_FSID.test(fsid);
}

/**
 * Indicates whether the input is a valid DSi Library user ID
 */
export function isKwzDsiLibraryFsid(fsid: string) {
  if (REGEX_KWZ_DSI_LIBRARY_FSID.test(fsid))
    return true;
  for (let suffix of KWZ_DSI_LIBRARY_FSID_SPECIAL_CASE_SUFFIX) {
    if (fsid.endsWith(suffix))
      return true;
  }
  return false;
}

/**
 * Indicates whether the input is a valid Flipnote Studio or Flipnote Studio 3D user ID
 */
export function isFsid(fsid: string) {
  return isPpmFsid(fsid) || isKwzFsid(fsid);
}

/**
 * Get the region for any valid Flipnote Studio user ID
 */
export function getPpmFsidRegion(fsid: string) : FlipnoteRegion {
  switch (fsid.charAt(0)) {
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

/**
 * Get the region for any valid Flipnote Studio 3D user ID.
 * NOTE: This may be incorrect for IDs that are not from the DSi Library.
 */
export function getKwzFsidRegion(fsid: string): FlipnoteRegion {
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
  switch (fsid.slice(0, 2)) {
    // note: might be incorrect
    case '00':
      return FlipnoteRegion.JPN;
    case '02':
      return FlipnoteRegion.USA;
    case '04':
      return FlipnoteRegion.EUR;
    default:
      return FlipnoteRegion.UNKNOWN;
  }
}

/**
 * Convert a KWZ Flipnote Studio ID (from a Nintendo DSi Library Flipnote) to the format used by PPM Flipnote Studio IDs.
 * Will return `null` if the conversion could not be made.
 */
export function convertKwzFsidToPpmFsid(fsid: string): string {
  if (REGEX_KWZ_DSI_LIBRARY_FSID.test(fsid))
    return (fsid.slice(19, 21) + fsid.slice(17, 19) + fsid.slice(15, 17) + fsid.slice(12, 14) + fsid.slice(10, 12) + fsid.slice(7, 9) + fsid.slice(5, 7) + fsid.slice(2, 4)).toUpperCase();
  return null;
}

/**
 * Convert a PPM Flipnote Studio ID to the format used by KWZ Flipnote Studio IDs (as seen in Nintendo DSi Library Flipnotes).
 * Will return `null` if the conversion could not be made.
 * 
 * NOTE: KWZ Flipnote Studio IDs contain an extra two characters at the beginning. It is not possible to resolve these from a PPM Flipnote Studio ID.
 */
export function convertPpmFsidToKwzFsidSuffix(fsid: string): string {
  if (REGEX_PPM_FSID.test(fsid))
    return (fsid.slice(14, 16) + fsid.slice(12, 14) + '-' + fsid.slice(10, 12) + fsid.slice(8, 10) + '-' + fsid.slice(6, 8) + fsid.slice(4, 6) + '-' + fsid.slice(2, 4) + fsid.slice(0, 2)).toLowerCase();
  return null;
}

/**
 * Convert a PPM Flipnote Studio ID to an array of all possible matching KWZ Flipnote Studio IDs (as seen in Nintendo DSi Library Flipnotes).
 * Will return `null` if the conversion could not be made.
 */
export function convertPpmFsidToPossibleKwzFsids(fsid: string): string[] {
  const kwzIdSuffix = convertPpmFsidToKwzFsidSuffix(fsid);
  if (kwzIdSuffix) {
    return [
      '00' + kwzIdSuffix,
      '10' + kwzIdSuffix,
      '12' + kwzIdSuffix,
      '14' + kwzIdSuffix,
    ];
  }
  return null;
}

/**
 * Tests if a KWZ Flipnote Studio ID (from a Nintendo DSi Library Flipnote) matches a given PPM-formatted Flipnote Studio ID.
 */
export function testKwzFsidMatchesPpmFsid(kwzFsid: string, ppmFsid: string): boolean {
  const ppmFromKwz = convertKwzFsidToPpmFsid(kwzFsid);
  return ppmFromKwz == ppmFsid;
}

/**
 * Get the region for any valid Flipnote Studio or Flipnote Studio 3D user ID
 */
export function getFsidRegion(fsid: string): FlipnoteRegion {
  if (isPpmFsid(fsid))
    return getPpmFsidRegion(fsid);
  else if (isKwzFsid(fsid))
    return getKwzFsidRegion(fsid);
  return FlipnoteRegion.UNKNOWN;
}