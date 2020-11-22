/** @internal */
declare type LoaderResolve = (result: ArrayBuffer) => void;
/** @internal */
declare type LoaderReject = (err?: any) => void;
/**
 * Loader interface
 *
 * The goal of each loader is to be able to tell when it can handle a particular source type, and resolve an ArrayBuffer for that source
 * @internal
 */
export interface LoaderDefinition<T> {
    /** Does this loader match the source type? */
    matches: (source: any) => boolean;
    /** Try loading the source. Passes an ArrayBuffer to resolve() if successful, calls reject() with an optional error if not */
    load: (source: T, resolve: LoaderResolve, reject: LoaderReject) => void;
}
export {};
