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
