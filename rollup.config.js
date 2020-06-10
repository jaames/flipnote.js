import { version } from './package.json';
import alias from '@rollup/plugin-alias';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import typescript from 'rollup-plugin-typescript2';
import { uglify } from 'rollup-plugin-uglify';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import bundleSize from 'rollup-plugin-bundle-size';
import glslify from 'rollup-plugin-glslify';

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
  input: (target === 'node') ? 'src/node.ts' : 'src/flipnote.ts',
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
    } : false
  ].filter(Boolean),
  plugins: [
    bundleSize(),
    nodeResolve(),
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
    devserver ? serve({
      contentBase: ['dist', 'test']
    }) : false,
    devserver ? livereload({
      watch: 'dist'
    }) : false,
    // only minify if we're producing a non-es production build
    prod && !esmodule ? uglify({
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