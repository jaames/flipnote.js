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