/// <reference types="node" />
import { LoaderDefinition } from './loaderDefinition';
/**
 * Loader for Buffer objects (Node only)
 * @internal
 */
declare const nodeBufferLoader: LoaderDefinition<Buffer>;
export default nodeBufferLoader;
