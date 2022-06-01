import { version } from './package.json';
import alias from '@rollup/plugin-alias';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonJs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import minifyHtml from 'rollup-plugin-minify-html-literals';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import bundleSize from 'rollup-plugin-bundle-size';
import glslify from 'rollup-plugin-glslify';
import svgo from 'rollup-plugin-svgo';
import dts from 'rollup-plugin-dts';

const ts = require('typescript');

const build = process.env.BUILD || 'development';
const devserver = process.env.DEV_SERVER || false;
const isProdBuild = build === 'production';

const banner = `/*!!
flipnote.js v${ version }
https://flipnote.js.org
A JavaScript library for parsing, converting, and in-browser playback of the proprietary animation formats used by Nintendo's Flipnote Studio and Flipnote Studio 3D apps.
2018 - 2022 James Daniel
Flipnote Studio is (c) Nintendo Co., Ltd. This project isn't affiliated with or endorsed by them in any way.
Keep on Flipnoting!
*/`;

const basePlugins = [
  nodeResolve({
    // browser: true
  }),
  commonJs(),
  alias({
    resolve: ['.jsx', '.js', '.ts', '.tsx'],
  }),
  replace({
    preventAssignment: true,
    FLIPNOTEJS_VERSION: JSON.stringify(version),
    PROD: isProdBuild ? 'true' : 'false',
    DEV_SERVER: devserver ? 'true' : 'false',
    // https://github.com/PolymerLabs/lit-element-starter-ts/blob/master/rollup.config.js
    'Reflect.decorate': 'undefined'
  }),
  glslify(),
  bundleSize(),
  // devserver + livereload
  devserver && serve({
    contentBase: ['dist', 'test']
  }),
  devserver && livereload({
    watch: 'dist'
  }),
].filter(Boolean);

const typescriptConfig = (target = 'es2019') => typescript({
  useTsconfigDeclarationDir: true,
  abortOnError: false,
  typescript: ts,
  tsconfigOverride: {
    compilerOptions: {
      target: target,
      declarationDir: './types',
      declaration: !devserver ? true : false,
      sourceMap: devserver ? true : false,
    },
  },
});

const minifierConfig = () => isProdBuild && terser({
  // preserve banner comment
  output: {
    comments: function(node, comment) {
      if (comment.type === 'comment2') {
        return /\!\!/i.test(comment.value);
      }
      return false;
    }
  }
});

const microbundleConfig = (src, dest) => (
  {
    input: [
      src,
    ],
    output: {
      file: dest,
      format: 'es',
      banner: banner,
    },
    plugins: basePlugins.concat([
      typescriptConfig('es2019'),

    ])
  }
);

const typeDeclarationConfig = (src, dest) => (
  {
    input: src,
    output: {
      file: dest, 
      format: 'es'
    },
    plugins: [dts()],
  }
)

module.exports = [
  // UMD build
  {
    input: [
      'src/flipnote.ts',
    ],
    output: {
      file: isProdBuild ? 'dist/flipnote.min.js' : 'dist/flipnote.js',
      format: 'umd',
      name: 'flipnote',
      exports: 'named',
      banner: banner,
      sourcemap: devserver ? true : false,
      sourcemapFile: isProdBuild ? 'dist/flipnote.min.js.map' : 'dist/flipnote.js.map'
    },
    plugins: basePlugins.concat([
      typescriptConfig('es5'),
      minifierConfig()
    ].filter(Boolean))
  },
  typeDeclarationConfig('types/flipnote.d.ts', 'dist/flipnote.d.ts'),

  // ES build
  {
    input: [
      'src/flipnote.ts',
    ],
    output: {
      file: 'dist/flipnote.es.js',
      format: 'es',
      name: 'flipnote',
      exports: 'named',
      banner: banner,
      sourcemap: devserver ? true : false,
      sourcemapFile: 'dist/flipnote.es.map'
    },
    plugins: basePlugins.concat([
      typescriptConfig('es2019')
    ].filter(Boolean))
  },

  // Web component build
  {
    input: [
      'src/flipnote.webcomponent.ts',
    ],
    output: {
      file: isProdBuild ? 'dist/flipnote.webcomponent.min.js' : 'dist/flipnote.webcomponent.js',
      format: 'umd',
      name: 'flipnote',
      exports: 'named',
      banner: banner,
      sourcemap: devserver ? true : false,
      sourcemapFile: isProdBuild ? 'dist/flipnote.webcomponent.min.js.map' : 'dist/flipnote.webcomponent.js.map'
    },
    plugins: basePlugins.concat([
      typescriptConfig('es2017'),
      minifierConfig(),
      isProdBuild && minifyHtml(),
      svgo({
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
    ].filter(Boolean))
  },
  typeDeclarationConfig('types/flipnote.webcomponent.d.ts', 'dist/flipnote.webcomponent.d.ts'),

  // tiny bundles for specific features

  isProdBuild && microbundleConfig('src/parsers/PpmParser.ts', 'dist/PpmParser.js'),
  isProdBuild && typeDeclarationConfig('types/parsers/PpmParser.d.ts', 'dist/PpmParser.d.ts'),

  isProdBuild && microbundleConfig('src/parsers/KwzParser.ts', 'dist/KwzParser.js'),
  isProdBuild && typeDeclarationConfig('types/parsers/KwzParser.d.ts', 'dist/KwzParser.d.ts'),

  isProdBuild && microbundleConfig('src/Player/index.ts', 'dist/Player.js'),
  isProdBuild && typeDeclarationConfig('types/Player/index.d.ts', 'dist/Player.d.ts'),

  isProdBuild && microbundleConfig('src/renderers/index.ts', 'dist/renderers.js'),
  isProdBuild && typeDeclarationConfig('types/renderers/index.d.ts', 'dist/renderers.d.ts'),

  isProdBuild && microbundleConfig('src/utils/index.ts', 'dist/utils.js'),
  isProdBuild && typeDeclarationConfig('types/utils/index.d.ts', 'dist/utils.d.ts'),
].filter(Boolean)