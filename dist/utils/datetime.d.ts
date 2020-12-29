/**
 * Convert a Nintendo DS or 3DS timestamp int to a JS Date object
 * @internal
 */
export declare function dateFromNintendoTimestamp(timestamp: number): Date;
/**
 * Get the duration (in seconds) of a number of framres running at a specified framerate
 * @internal
 */
export declare function timeGetNoteDuration(frameCount: number, framerate: number): number;
