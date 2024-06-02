import { isBrowser } from '../../utils';

/** @internal */
const raf = isBrowser && (window.requestAnimationFrame || (window as any).webkitRequestAnimationFrame);

/** @internal */
export function nextPaint(callback: Function) {
  if (isBrowser)
    raf(() => raf(() => callback()));
  else
    callback();
}