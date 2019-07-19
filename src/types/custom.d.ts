declare module '*.vert' {
  const content: string;
  export default content;
}

declare module '*.frag' {
  const content: string;
  export default content;
}

declare var VERSION: string;
declare var IS_PROD: boolean;
declare var IS_DEV_SERVER: boolean;