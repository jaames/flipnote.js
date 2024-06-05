/**
 * @internal
 */
export type AsyncTuple<ErrorType extends any = Error, DataType extends any = unknown> =
  | [ ErrorType, null ]
  | [ null, DataType ];

/**
 * Gracefully handles a given Promise factory.
 * @internal
 * @example
 * const [ error, data ] = await until(() => asyncAction())
 */
export const until = async <ErrorType extends any = Error, DataType extends any = unknown>(promise: () => Promise<DataType>): Promise<AsyncTuple<ErrorType, DataType>> => {
  try {
    const data = await promise().catch((error) => {
      throw error;
    });
    return [ null, data ];
  } 
  catch (error) {
    return [ error, null ];
  }
};