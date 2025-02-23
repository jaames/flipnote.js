import replace from '@rollup/plugin-replace';

export const replacements = () => replace({
  preventAssignment: true,
  values: {
    FLIPNOTEJS_VERSION: JSON.stringify(process.env.npm_package_version),
    // https://github.com/PolymerLabs/lit-element-starter-ts/blob/master/rollup.config.js
    // 'Reflect.decorate': 'undefined'
  }
});