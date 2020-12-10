/** @internal */
export function createTimeRanges(ranges: [number, number][]): TimeRanges {
  return {
    length: ranges.length,
    start: (i: number) => ranges[i][0],
    end: (i: number) => ranges[i][1],
  }
}