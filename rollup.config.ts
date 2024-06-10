import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import glslify from 'rollup-plugin-glslify';
import minifyHtml from 'rollup-plugin-html-literals';
// @ts-ignore
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

import {
  cleanDir,
  banner,
  replacements,
  svg,
  minify,
  size,
} from './buildSupport';

const isServer = (!!process.env.SERVER) || false;

const doBuild = (input: string, outputBase: string, opts: {
  name?: string,
} = {}) => ({
  input,
  plugins: [
    // Resolve node module imports
    nodeResolve(),
    // .ts compilation
    typescript({
      outputToFilesystem: true,
      exclude: [
        'buildSupport/**/*',
        'rollup.config.ts'
      ],
      compilerOptions: {
        rootDir: 'src',
        // Generate .d.ts files from TypeScript declarations
        declaration: true,
        declarationDir: `dist/types/`,
      },
      sourceMap: opts.name !== undefined,
      inlineSources: isServer,
    }),
    // Replace version number and other strings
    replacements(),
    // Process GLSL shaders for WebGL
    glslify(),
    // Process HTML for web components
    !isServer && minifyHtml(),
    // Process SVG for web components
    svg(),
    // Dev server w/ hot reload
    isServer && serve({
      contentBase: ['dist', 'test']
    }),
    isServer && livereload({
      watch: ['dist']
    }),
  ].filter(Boolean),
  output: [
    // ES module build
    !isServer && {
      banner,
      file: `dist/esm/${outputBase}.mjs`,
      format: 'es',
      exports: 'named',
    },
    // Legacy CommonJS module build
    !isServer && {
      banner,
      file: `dist/cjs/${outputBase}.cjs`,
      format: 'cjs',
      exports: 'named',
    },
    // Browser build - the only one used in server mode
    opts.name && {
      banner,
      name: opts.name,
      file: `dist/${ outputBase }.js`,
      format: 'iife',
      exports: 'named',
      sourcemap: true,
      sourcemapFile: `dist/${ outputBase }.js.map`,
      plugins: [size()]
    },
    // Minified browser build
    opts.name && !isServer && {
      banner,
      name: opts.name,
      file: `dist/${ outputBase }.min.js`,
      format: 'iife',
      exports: 'named',
      sourcemap: true,
      sourcemapFile: `dist/${ outputBase }.min.js.map`,
      plugins: [minify(), size()]
    },
    // Demo site browser build
    opts.name && !isServer && {
      name: opts.name,
      file: `www/public/${outputBase}.min.js`,
      format: 'iife',
      exports: 'named',
      sourcemap: true,
      sourcemapFile: `www/public/${outputBase}.min.js.map`,
      plugins: [minify()]
    }
  ].filter(Boolean),
});

cleanDir('./dist');

export default [
  // Main bundles - one with the webcomponent player included, one without
  doBuild('./src/flipnote.webcomponent.ts', 'flipnote.webcomponent', { name: 'flipnote' }),
  !isServer && doBuild('./src/flipnote.ts', 'flipnote', { name: 'flipnote' }),

  // Partial bundles
  !isServer && doBuild('./src/parsers/PpmParser.ts', 'PpmParser'),
  !isServer && doBuild('./src/parsers/KwzParser.ts', 'KwzParser'),
  !isServer && doBuild('./src/Player/index.ts', 'Player'),
  !isServer && doBuild('./src/renderers/index.ts', 'renderers'),
  !isServer && doBuild('./src/utils/index.ts', 'utils'),
].filter(Boolean);