/** 
 * Loader interface.
 * The goal of a loader is to be able to tell when it can handle a particular source type, and then resolve an {@link ArrayBuffer} for that source.
 */
export interface LoaderDefinition<T> {
  /**
   * Unique loader name
   */
  name: string;
  /**
   * Is this loader able to process the input source type?
   */
  matches: (source: any) => boolean;
  /**
   * Try loading the source (can be async) and return an ArrayBuffer
   */
  load: (source: T) => Promise<ArrayBufferLike>;
};