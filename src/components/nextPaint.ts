/** @internal */
const raf = (function() {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame;
})();

/** @internal */
export function nextPaint(callback: Function) {
  raf(() => raf(() => callback()));
}