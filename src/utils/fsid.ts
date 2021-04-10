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
const REGEX_PPM_FSID = /^[0159]{1}[0-9A-F]{15}$/;

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
const REGEX_KWZ_DSI_LIBRARY_FSID = /^(00|10|12|14)[0-9a-f]{2}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}[0159]{1}[0-9a-f]{1}$/; 

/**
 * Indicates whether the input is a valid Flipnote Studio user ID
 */
export function isPpmFsid(fsid: string) {
  return REGEX_PPM_FSID.test(fsid);
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
  return REGEX_KWZ_DSI_LIBRARY_FSID.test(fsid);
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
 * Get the region for any valid Flipnote Studio 3D user ID
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
 * Get the region for any valid Flipnote Studio or Flipnote Studio 3D user ID
 */
export function getFsidRegion(fsid: string): FlipnoteRegion {
  if (isPpmFsid(fsid))
    return getPpmFsidRegion(fsid);
  else if (isKwzFsid(fsid))
    return getKwzFsidRegion(fsid);
  return FlipnoteRegion.UNKNOWN;
}