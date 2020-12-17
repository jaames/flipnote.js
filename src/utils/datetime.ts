/**
 * Number of seconds between the UNIX timestamp epoch (jan 1 1970) and the Nintendo timestamp epoch (jan 1 2000)
 * @internal
 */
const UNIX_EPOCH_2000 = 946684800;

/**
 * Convert a Nintendo DS or 3DS timestamp int to a JS Date object
 * @internal
 */
export function dateFromNintendoTimestamp(timestamp: number) {
  return new Date((timestamp + UNIX_EPOCH_2000) * 1000);
}

/**
 * Get the duration (in seconds) of a number of framres running at a specified framerate
 * @internal
 */
export function timeGetNoteDuration(frameCount: number, framerate: number) {
  // multiply and devide by 100 to get around floating precision issues
  return ((frameCount * 100) * (1 / framerate)) / 100;
}