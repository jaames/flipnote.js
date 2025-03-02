/**
 * Number of seconds between the UNIX timestamp epoch (jan 1 1970) and the Nintendo timestamp epoch (jan 1 2000).
 * @internal
 */
const NINTENDO_UNIX_EPOCH = 946684800;

/**
 * Convert a Nintendo DS or 3DS timestamp integer to a JS Date object.
 * @internal
 */
export const dateFromNintendoTimestamp = (timestamp: number) =>
  new Date((timestamp + NINTENDO_UNIX_EPOCH) * 1000);

/**
 * Convert a JS Date to a Nintendo timestamp integer.
 */
export const dateToNintendoTimestamp = (date: Date) =>
  Math.floor((date.getTime() / 1000) - NINTENDO_UNIX_EPOCH);

/**
 * Get the duration (in seconds) of a number of frames running at a specified framerate.
 * @internal
 */
export const timeGetNoteDuration = (frameCount: number, framerate: number) =>
  // multiply and divide by 100 to get around floating precision issues
  ((frameCount * 100) * (1 / framerate)) / 100;