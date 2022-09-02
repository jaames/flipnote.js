import { isBrowser } from './env';

/** @internal */
export const saveData = (function () {
  if (!isBrowser) {
    return function(){}
  }
  const a = document.createElement('a');
  return function (blob: Blob, filename:string) {
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };
})();
