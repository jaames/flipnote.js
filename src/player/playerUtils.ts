/**
 * @internal
 */
export const createTimeRanges = (ranges: [number, number][]): TimeRanges => ({
  length: ranges.length,
  start: (i: number) => ranges[i][0],
  end: (i: number) => ranges[i][1],
});

/**
 * @internal
 */
export const padNumber = (num: number, strLength: number) =>
  num.toString().padStart(strLength, '0');

/**
 * @internal
 */
export const formatTime = (seconds: number) => {
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${ m }:${ padNumber(s, 2) }`
};