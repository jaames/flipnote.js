import { isBrowser } from './env';

/** @internal */
const raf = isBrowser && (window.requestAnimationFrame || window.webkitRequestAnimationFrame);

/** @internal */
export function nextPaint(callback: Function) {
  if (isBrowser)
    raf(() => raf(() => callback()));
  else
    callback();
}