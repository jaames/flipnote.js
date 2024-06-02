// @ts-ignore
import svgo from 'rollup-plugin-svgo';

export const svg = () => svgo({
  plugins: [
    { name: 'removeViewBox', active: false },
    { name: 'removeDimensions', active: true },
    { name: 'removeUnknownsAndDefaults', active: true },
  ]
})