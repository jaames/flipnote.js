export declare class ByteArray {
    static pageSize: number;
    pageSize: number;
    currPageIndex: number;
    pages: Uint8Array[];
    currPage: Uint8Array;
    cursor: number;
    constructor();
    private newPage;
    getData(): Uint8Array;
    getBuffer(): ArrayBufferLike;
    writeByte(val: number): void;
    writeBytes(array: Uint8Array | number[], offset?: number, length?: number): void;
}
