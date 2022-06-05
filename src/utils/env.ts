import { assert } from './assert';

/**
 * Webpack tries to replace inline calles to require() with polyfills, 
 * but we don't want that, since we only use require to add extra features in NodeJs environments
 * 
 * Modified from:
 * https://github.com/getsentry/sentry-javascript/blob/bd35d7364191ebed994fb132ff31031117c1823f/packages/utils/src/misc.ts#L9-L11
 * https://github.com/getsentry/sentry-javascript/blob/89bca28994a0eaab9bc784841872b12a1f4a875c/packages/hub/src/hub.ts#L340
 * @internal
 */
export function dynamicRequire(nodeModule: NodeModule, p: string) {
  try {
    return nodeModule.require(p);
  }
  catch {
    throw new Error(`Could not require(${p})`);
  }
}

/**
 * Safely get global scope object
 * @internal
 */
export function getGlobalObject(): Window | typeof globalThis | {} {
  return isNode
    ? global
    : typeof window !== 'undefined'
    ? window
    : typeof self !== 'undefined'
    ? self
    : {};
}

/**
 * Utils to find out information about the current code execution environment
 */

/**
 * Is the code running in a browser environment?
 * @internal
 */
export const isBrowser = typeof window !== 'undefined' 
  && typeof window.document !== 'undefined';

/**
 * Assert that the current environment should support browser APIs
 * @internal
 */
export function assertBrowserEnv() {
  return assert(isBrowser, 'This feature is only available in browser environments');
}

/**
 * Is the code running in a Node environment?
 * @internal
 */
export const isNode = typeof process !== 'undefined'
  && process.versions != null
  && process.versions.node != null;

/**
 * Assert that the current environment should support NodeJS APIs
 * @internal
 */
export function assertNodeEnv() {
  return assert(isNode, 'This feature is only available in NodeJS environments');
}

// TODO: Deno support?

/**
 * Is the code running in a Web Worker enviornment?
 * @internal
 */
export const isWebWorker = typeof self === 'object'
  && self.constructor
  && self.constructor.name === 'DedicatedWorkerGlobalScope';

/**
 * Assert that the current environment should support NodeJS APIs
 * @internal
 */
export function assertWebWorkerEnv() {
  return assert(isWebWorker, 'This feature is only available in WebWorker environments');
}