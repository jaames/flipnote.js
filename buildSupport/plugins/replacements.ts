import pkg from '../../package.json' assert { type: 'json' };

import replace from '@rollup/plugin-replace';

export const replacements = () => replace({
  preventAssignment: true,
  values: {
    FLIPNOTEJS_VERSION: JSON.stringify(pkg.version),
    // https://github.com/PolymerLabs/lit-element-starter-ts/blob/master/rollup.config.js
    // 'Reflect.decorate': 'undefined'
  }
});