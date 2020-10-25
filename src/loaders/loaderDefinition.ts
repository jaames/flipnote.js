type LoaderResolve = (result: ArrayBuffer) => void;
type LoaderReject = (err: any) => void;

export interface LoaderDefinition<T> {
  matches: (source: any) => boolean,
  load: (source: T, resolve: LoaderResolve, reject: LoaderReject) => void;
};