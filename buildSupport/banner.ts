import pkg from '../package.json' assert { type: 'json' };

export const banner = `/*!!
 * flipnote.js v${ pkg.version }
 * https://flipnote.js.org
 * A JavaScript library for Flipnote Studio animation files
 * 2018 - ${ new Date().getFullYear() } James Daniel
 * Flipnote Studio is (c) Nintendo Co., Ltd. This project isn't affiliated with or endorsed by them in any way.
*/`;