/**
 * Assert condition is true
 * @internal
 */
export declare function assert(condition: boolean, errMsg?: string): asserts condition;
/**
 * Assert that a value exists
 * @internal
 */
export declare function assertExists<T>(value: T | null | undefined, name?: string): T;
/**
 * Assert that a numberical value is between upper and lower bounds
 * @internal
 */
export declare function assertRange(value: number, min: number, max: number, name?: string): asserts value;
