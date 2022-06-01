/**
 * @internal
 */
export declare type AsyncTuple<ErrorType extends any = Error, DataType extends any = unknown> = [ErrorType, null] | [null, DataType];
/**
 * Gracefully handles a given Promise factory.
 * @internal
 * @example
 * const [ error, data ] = await until(() => asyncAction())
 */
export declare const until: <ErrorType extends unknown = Error, DataType extends unknown = unknown>(promise: () => Promise<DataType>) => Promise<AsyncTuple<ErrorType, DataType>>;
