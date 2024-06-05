import { isBrowser } from './env';

/** @internal */
const raf = isBrowser && (window.requestAnimationFrame || (window as any).webkitRequestAnimationFrame);

/** @internal */
export const nextPaint = (callback: Function) => {
  if (isBrowser)
    raf(() => raf(() => callback()));
  else
    callback();
};