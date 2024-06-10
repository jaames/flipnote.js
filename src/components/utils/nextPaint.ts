import { isBrowser } from '../../utils';

/**
 * @internal
 */
const raf = isBrowser && (window.requestAnimationFrame || (window as any).webkitRequestAnimationFrame);

/**
 * @internal
 */
export const nextPaint = (callback: () => {}) => {
  if (isBrowser)
    raf(() => raf(() => callback()));
  else
    callback();
};