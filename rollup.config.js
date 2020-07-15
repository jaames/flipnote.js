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

const target = process.env.TARGET || "web";
const build = process.env.BUILD || "development";
const devserver = process.env.DEV_SERVER || false;
const esmodule = process.env.ES_MODULE || false;
const prod = build === "production";

const banner = `/*!!
 flipnote.js v${version} (${target} ver)
 Browser-based playback of .ppm and .kwz animations from Flipnote Studio and Flipnote Studio 3D
 2018 - 2020 James Daniel
 github.com/jaames/flipnote.js
 Flipnote Studio is (c) Nintendo Co., Ltd.
*/
`

module.exports = {
  input: [
    (target === 'web') ? 'src/flipnote.ts' : false,
    (target === 'node') ? 'src/node.ts' : false,
    (target === 'webcomponent') ? 'src/webcomponent.ts' : false,
  ].filter(Boolean).join(''),
  output: [
    (target === 'node') ? {
      file: 'dist/node.js',
      format: 'es',
      name: 'flipnote',
      exports: 'named',
      banner: banner,
      sourcemap: devserver ? true : false,
      sourcemapFile: 'dist/node.map'
    } : false,
    (target === 'web') && (esmodule) ? {
      file: 'dist/flipnote.es.js',
      format: 'es',
      name: 'flipnote',
      exports: 'named',
      banner: banner,
      sourcemap: devserver ? true : false,
      sourcemapFile: 'dist/flipnote.es.map'
    } : false,
    (target === 'web') && (!esmodule) ? {
      file: prod ? 'dist/flipnote.min.js' : 'dist/flipnote.js',
      format: 'umd',
      name: 'flipnote',
      exports: 'named',
      banner: banner,
      sourcemap: devserver ? true : false,
      sourcemapFile: prod ? 'dist/flipnote.min.js.map' : 'dist/flipnote.js.map'
    } : false,
    (target === 'webcomponent') ? {
      file: prod ? 'dist/flipnote.webcomponent.min.js' : 'dist/flipnote.webcomponent.js',
      format: 'umd',
      name: 'flipnote',
      exports: 'named',
      banner: banner,
      sourcemap: devserver ? true : false,
      sourcemapFile: prod ? 'dist/flipnote.webcomponent.min.js.map' : 'dist/flipnote.webcomponent.js.map'
    } : false
  ].filter(Boolean),
  plugins: [
    // use svelte for webcomponent build
    target === 'webcomponent' ? svelte({
      customElement: true,
			// enable run-time checks when not in production
			dev: !prod,
      preprocess: autoPreprocess()
    }) : false,
    target === 'webcomponent' ? svgo({
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
      PROD: prod ? 'true' : 'false',
      DEV_SERVER: devserver ? 'true' : 'false'
    }),
    typescript({
      abortOnError: false,
      typescript: require('typescript'),
      tsconfigOverride: {
        compilerOptions: {
          target: esmodule ? 'esnext' : 'es5',
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
    prod && !esmodule ? terser({
      mangle: {
        properties: {
          regex: /^_/
        },
      },
      output: {
        comments: function(node, comment) {
          if (comment.type === 'comment2') {
            // preserve banner comment
            return /\!\!/i.test(comment.value);
          }
          return false;
        }
      }
    }) : false,
  ].filter(Boolean)
};