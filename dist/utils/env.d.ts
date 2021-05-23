/// <reference types="node" />
/**
 * Webpack tries to replace inline calles to require() with polyfills,
 * but we don't want that, since we only use require to add extra features in NodeJs environments
 *
 * Modified from:
 * https://github.com/getsentry/sentry-javascript/blob/bd35d7364191ebed994fb132ff31031117c1823f/packages/utils/src/misc.ts#L9-L11
 * https://github.com/getsentry/sentry-javascript/blob/89bca28994a0eaab9bc784841872b12a1f4a875c/packages/hub/src/hub.ts#L340
 * @internal
 */
export declare function dynamicRequire(nodeModule: NodeModule, p: string): any;
/**
 * Safely get global scope object
 * @internal
 */
export declare function getGlobalObject(): Window | NodeJS.Global | {};
/**
 * Utils to find out information about the current code execution environment
 */
/**
 * Is the code running in a browser environment?
 * @internal
 */
export declare const isBrowser: boolean;
/**
 * Assert that the current environment should support browser APIs
 * @internal
 */
export declare function assertBrowserEnv(): void;
/**
 * Is the code running in a Node environment?
 * @internal
 */
export declare const isNode: boolean;
/**
 * Assert that the current environment should support NodeJS APIs
 * @internal
 */
export declare function assertNodeEnv(): void;
/**
 * Is the code running in a Web Worker enviornment?
 * @internal
 */
export declare const isWebWorker: boolean;
/**
 * Assert that the current environment should support NodeJS APIs
 * @internal
 */
export declare function assertWebWorkerEnv(): void;
