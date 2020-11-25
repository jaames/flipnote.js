/** @internal */
export declare class ByteArray {
    static pageSize: number;
    private pageSize;
    private currPageIndex;
    private pages;
    private currPage;
    private cursor;
    constructor();
    private newPage;
    getData(): Uint8Array;
    getBuffer(): ArrayBufferLike;
    writeByte(val: number): void;
    writeBytes(bytes: Uint8Array | number[], offset?: number, length?: number): void;
}
