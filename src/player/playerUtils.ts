/** @internal */
export function createTimeRanges(ranges: [number, number][]): TimeRanges {
  return {
    length: ranges.length,
    start: (i: number) => ranges[i][0],
    end: (i: number) => ranges[i][1],
  }
}

/** @internal */
export function padNumber(num: number, strLength: number) {
  return num.toString().padStart(strLength, '0');
}

/** @internal */
export function formatTime(seconds: number) {
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${ m }:${ padNumber(s, 2) }`
}