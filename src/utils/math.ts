/** 
 * Clamp a number n between l and h
 * @internal 
 */
export const clamp = (n: number, l: number, h: number) => {
  if (n < l)
    return l;
  if (n > h)
    return h;
  return n;
};

/** 
 * Interpolate between a and b - returns a if fac = 0, b if fac = 1, and somewhere between if 0 < fac < 1
 * @internal
 */
export const lerp = (a: number, b: number, fac: number) => a + fac * (b - a);