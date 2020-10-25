import { version } from './package.json';
import alias from '@rollup/plugin-alias';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import bundleSize from 'rollup-plugin-bundle-size';
import glslify from 'rollup-plugin-glslify';
import svelte from 'rollup-plugin-svelte';
import svgo from 'rollup-plugin-svgo';
import autoPreprocess from 'svelte-preprocess';

const target = process.env.TARGET || 'web';
const build = process.env.BUILD || 'development';
const devserver = process.env.DEV_SERVER || false;
const isEsmoduleBuild = process.env.ES_MODULE || false;
const isProdBuild = build === 'production';
const isTargetWeb = target === 'web';
const isTargetWebcomponent = target === 'webcomponent';

const banner = `/*!!
 flipnote.js v${ version } (${ target } build)
 Javascript parsing and in-browser playback for the .PPM and .KWZ animation formats used by Flipnote Studio and Flipnote Studio 3D.
 Flipnote Studio is (c) Nintendo Co., Ltd. This project isn't endorsed by them in any way.
 2018 - 2021 James Daniel
 github.com/jaames/flipnote.js
 Keep on Flipnoting!
*/
`

module.exports = {
  input: [
    (isTargetWeb) ? 'src/flipnote.ts' : false,
    (isTargetWebcomponent) ? 'src/webcomponent.ts' : false,
  ].filter(Boolean).join(''),
  output: [
    (isTargetWeb) && (isEsmoduleBuild) ? {
      file: 'dist/flipnote.es.js',
      format: 'es',
      name: 'flipnote',
      exports: 'named',
      banner: banner,
      sourcemap: devserver ? true : false,
      sourcemapFile: 'dist/flipnote.es.map'
    } : false,
    (isTargetWeb) && (!isEsmoduleBuild) ? {
      file: isProdBuild ? 'dist/flipnote.min.js' : 'dist/flipnote.js',
      format: 'umd',
      name: 'flipnote',
      exports: 'named',
      banner: banner,
      sourcemap: devserver ? true : false,
      sourcemapFile: isProdBuild ? 'dist/flipnote.min.js.map' : 'dist/flipnote.js.map'
    } : false,
    (isTargetWebcomponent) ? {
      file: isProdBuild ? 'dist/flipnote.webcomponent.min.js' : 'dist/flipnote.webcomponent.js',
      format: 'umd',
      name: 'flipnote',
      exports: 'named',
      banner: banner,
      sourcemap: devserver ? true : false,
      sourcemapFile: isProdBuild ? 'dist/flipnote.webcomponent.min.js.map' : 'dist/flipnote.webcomponent.js.map'
    } : false
  ].filter(Boolean),
  plugins: [
    // use svelte for webcomponent build
    isTargetWebcomponent ? svelte({
      customElement: true,
			// enable run-time checks when not in production
			dev: !isProdBuild,
      preprocess: autoPreprocess()
    }) : false,
    isTargetWebcomponent ? svgo({
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
    }) : false,
    bundleSize(),
    nodeResolve({
			browser: true,
			dedupe: ['svelte']
		}),
    alias({
      resolve: ['.jsx', '.js', '.ts', '.tsx'],
    }),
    replace({
      VERSION: JSON.stringify(version),
      PROD: isProdBuild ? 'true' : 'false',
      DEV_SERVER: devserver ? 'true' : 'false'
    }),
    typescript({
      abortOnError: false,
      typescript: require('typescript'),
      tsconfigOverride: {
        compilerOptions: {
          target: isEsmoduleBuild ? 'esnext' : 'es5',
          declaration: !devserver ? true : false,
          sourceMap: devserver ? true : false,
        },
      },
    }),
    glslify(),
    // devserver + livereload
    devserver ? serve({
      contentBase: ['dist', 'test']
    }) : false,
    devserver ? livereload({
      watch: 'dist'
    }) : false,
    // only minify if we're producing a non-es production build
    isProdBuild && !isEsmoduleBuild ? terser({
      // mangle props starting with _, since they're usually not public parts of the API
      mangle: {
        properties: {
          regex: /^_/
        },
      },
      // preserve banner comment
      output: {
        comments: function(node, comment) {
          if (comment.type === 'comment2') {
            return /\!\!/i.test(comment.value);
          }
          return false;
        }
      }
    }) : false,
  ].filter(Boolean)
};