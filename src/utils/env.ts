import { assert } from './assert';

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