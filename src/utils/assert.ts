/**
 * Assert condition is true
 * @internal
 */
export function assert(condition: boolean, errMsg: string = 'Assert failed'): asserts condition {
  if (!condition)
    throw new Error(errMsg);
}

/**
 * Assert that a value exists
 * @internal
 */
export function assertExists<T>(value: T | null | undefined, name=''): T {
  if (value === undefined || value === null)
    throw new Error(`Missing object ${ name }`);
  return value;
}

/**
 * Assert that a numerical value is between upper and lower bounds
 * @internal
 */
export function assertRange(value: number, min: number, max: number, name=''): asserts value {
  assert(value >= min && value <= max, `${ name || 'value'} ${ value } should be between ${ min } and ${ max }`);
}