/**
 * Assert condition is true.
 * @internal
 */
export function assert(condition: boolean, errMsg: string = 'Assert failed'): asserts condition {
  if (!condition)
    err(errMsg);
}

/**
 * Assert that a value exists.
 * @internal
 */
export const assertExists = <T>(value: T | null | undefined, name=''): T => {
  if (value === undefined || value === null)
    throw new Error(`flipnote.js error: Missing object ${ name }`);
  return value;
};

/**
 * Assert that a numerical value is between upper and lower bounds.
 * @internal
 */
export const assertRange = (value: number, min: number, max: number, name='') =>
  assert(value >= min && value <= max, `flipnote.js error: ${ name || 'value'} ${ value } should be between ${ min } and ${ max }`);

/**
 * Assert condition is true.
 * @internal
 */
export const err = (errMsg: string = 'Assert failed') => {
  throw new Error('flipnote.js error: ' + errMsg);
}