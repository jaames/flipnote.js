export declare class ByteArray {
    static pageSize: number;
    private page;
    private pages;
    private cursor;
    constructor();
    private newPage;
    getData(): Uint8Array;
    getBuffer(): ArrayBufferLike;
    writeByte(val: number): void;
    writeBytes(array: Uint8Array | number[], offset?: number, length?: number): void;
}
