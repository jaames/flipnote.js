import { version } from './package.json';
import alias from '@rollup/plugin-alias';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonJs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import bundleSize from 'rollup-plugin-bundle-size';
import glslify from 'rollup-plugin-glslify';
import svgo from 'rollup-plugin-svgo';

const target = process.env.TARGET || 'web';
const build = process.env.BUILD || 'development';
const devserver = process.env.DEV_SERVER || false;
const isEsmoduleBuild = process.env.ES_MODULE || false;
const isProdBuild = build === 'production';
const isTargetWeb = target === 'web';
const isTargetWebcomponent = target === 'webcomponent';

const banner = `/*!!
 flipnote.js v${ version } (${ target } build)
 A JavaScript library for parsing, converting, and in-browser playback of the proprietary animation formats used by Nintendo's Flipnote Studio and Flipnote Studio 3D apps.
 Flipnote Studio is (c) Nintendo Co., Ltd. This project isn't affiliated with or endorsed by them in any way.
 2018 - 2021 James Daniel
 https://flipnote.js.org
 Keep on Flipnoting!
*/`;

module.exports = {
  input: [
    isTargetWeb && 'src/flipnote.ts',
    isTargetWebcomponent && 'src/flipnote.webcomponent.ts',
  ].filter(Boolean).join(''),
  output: [
    (isTargetWeb) && (isEsmoduleBuild) && {
      file: 'dist/flipnote.es.js',
      format: 'es',
      name: 'flipnote',
      exports: 'named',
      banner: banner,
      sourcemap: devserver ? true : false,
      sourcemapFile: 'dist/flipnote.es.map'
    },
    (isTargetWeb) && (!isEsmoduleBuild) && {
      file: isProdBuild ? 'dist/flipnote.min.js' : 'dist/flipnote.js',
      format: 'umd',
      name: 'flipnote',
      exports: 'named',
      banner: banner,
      sourcemap: devserver ? true : false,
      sourcemapFile: isProdBuild ? 'dist/flipnote.min.js.map' : 'dist/flipnote.js.map'
    },
    isTargetWebcomponent && {
      file: isProdBuild ? 'dist/flipnote.webcomponent.min.js' : 'dist/flipnote.webcomponent.js',
      format: 'umd',
      name: 'flipnote',
      exports: 'named',
      banner: banner,
      sourcemap: devserver ? true : false,
      sourcemapFile: isProdBuild ? 'dist/flipnote.webcomponent.min.js.map' : 'dist/flipnote.webcomponent.js.map'
    }
  ].filter(Boolean),
  plugins: [
    isTargetWebcomponent && svgo({
      plugins: [
        {
          removeViewBox: false
        },
        {
          removeDimensions: true
        },
        {
          removeUnknownsAndDefaults: true
        },
      ]
    }),
    bundleSize(),
    nodeResolve({
      // browser: true
    }),
    commonJs(),
    alias({
      resolve: ['.jsx', '.js', '.ts', '.tsx'],
    }),
    replace({
      VERSION: JSON.stringify(version),
      PROD: isProdBuild ? 'true' : 'false',
      DEV_SERVER: devserver ? 'true' : 'false',
      // https://github.com/PolymerLabs/lit-element-starter-ts/blob/master/rollup.config.js
      'Reflect.decorate': 'undefined'
    }),
    typescript({
      abortOnError: false,
      typescript: require('typescript'),
      tsconfigOverride: {
        compilerOptions: {
          target: (() => {
            if (isTargetWebcomponent)
              return 'es2017';
            else if (isEsmoduleBuild)
              return 'esnext';
            else
              return 'es5';
          })(),
          declaration: !devserver ? true : false,
          sourceMap: devserver ? true : false,
        },
      },
    }),
    glslify(),
    // devserver + livereload
    devserver && serve({
      contentBase: ['dist', 'test']
    }),
    devserver && livereload({
      watch: 'dist'
    }),
    // only minify if we're producing a non-es production build
    isProdBuild && !isEsmoduleBuild && terser({
      // preserve banner comment
      output: {
        comments: function(node, comment) {
          if (comment.type === 'comment2') {
            return /\!\!/i.test(comment.value);
          }
          return false;
        }
      }
    }),
  ].filter(Boolean)
};