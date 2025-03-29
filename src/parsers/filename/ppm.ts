const REGEX_PPM_LOCAL_FILENAME = /^[0-9A-Z]{1}[0-9A-F]{5}_[0-9A-F]{13}_[0-9]{3}$/;

const REGEX_PPM_FILENAME = /^[0-9A-F]{6}_[0-9A-F]{13}_[0-9]{3}$/;

/**
 * PPM filenames can be decoded and broken down into different fields. This object represents a unpacked PPM filename.
 */
export interface FlipnotePpmUnpackedFilename {
  /** DSi MAC address suffix as hex, e.g. `AABBCC` */
  macSuffix: string;
  /** Random 5-digit hex string */
  random1: string;
  /** Random 8-digit hex string */
  random2: string;
  /** Number of edits */
  edits: number;
};

const CHECKSUM_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Determines if a string matches the PPM filename format.
 */
export const isPpmFilename = (filename: string) =>
  REGEX_PPM_LOCAL_FILENAME.test(filename);

/**
 * Does the same thing as {@link isPpmFilename}, expect it only matches "basic" filenames, without the checksum character that is added when saving a Flipnote to the filesystem.
 */
export const isPpmBasicFilename = (filename: string) =>
  REGEX_PPM_FILENAME.test(filename);

/**
 * 
 */
export const ppmFilenameCalculateCheckDigit = (filename: string) => {
  let sum = parseInt(filename.slice(0, 2), 16);
  for (let i = 1; i < 16; i++) {
    const char = filename.charCodeAt(i);
    sum = (sum + char) & 0xff;
  }
  return CHECKSUM_ALPHABET[sum % 36];
};

/**
 * 
 */
export const ppmFilenameDecode = (filename: string): FlipnotePpmUnpackedFilename => {
  const macSuffix = filename.slice(0, 6);
  const random1 = filename.slice(7, 12);
  const random2 = filename.slice(12, 19);
  const edits = parseInt(filename.slice(-3));
  return { macSuffix, random1, random2, edits };
};

/**
 * 
 */
export const ppmFilenameEncode = (filename: FlipnotePpmUnpackedFilename): string => {
  const edits = filename.edits.toString().padEnd(3, '0');
  return `${ filename.macSuffix }_${ filename.random1 }_${ filename.random2 }_${ edits }`;
};