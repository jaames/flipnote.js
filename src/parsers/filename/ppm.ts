const REGEX_PPM_LOCAL_FILENAME = /^[0-9A-Z]{1}[0-9A-F]{5}_[0-9A-F]{13}_[0-9]{3}$/;

const REGEX_PPM_FILENAME = /^[0-9A-F]{6}_[0-9A-F]{13}_[0-9]{3}$/;

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

// TODO: checksum reverse-engineering and implementation