// Entrypoint for web and node

export * from './parsers';

export * from './player';

export * from './components/PlayerMixin';

export * from './encoders';

export * from './renderers';

export * from './webaudio';

/**
 * @namespace loaders
 */
export * as loaders from './loaders';

export * from './parseSource';

/** 
 * flipnote.js library version (exported as `flipnote.version`).
 * You can find the latest version on the project's [NPM](https://www.npmjs.com/package/flipnote.js) page.
 */
export const version = FLIPNOTEJS_VERSION; // replaced by @rollup/plugin-replace;