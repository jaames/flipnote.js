/** datastream serves as a wrapper around the DataView API to help keep track of the offset into the stream */
export declare const enum SeekOrigin {
    Begin = 0,
    Current = 1,
    End = 2
}
export declare class DataStream {
    buffer: ArrayBuffer;
    private data;
    private cursor;
    constructor(arrayBuffer: ArrayBuffer);
    get bytes(): Uint8Array;
    get byteLength(): number;
    seek(offset: number, whence?: SeekOrigin): void;
    readUint8(): number;
    writeUint8(value: number): void;
    readInt8(): number;
    writeInt8(value: number): void;
    readUint16(littleEndian?: boolean): number;
    writeUint16(value: number, littleEndian?: boolean): void;
    readInt16(littleEndian?: boolean): number;
    writeInt16(value: number, littleEndian?: boolean): void;
    readUint32(littleEndian?: boolean): number;
    writeUint32(value: number, littleEndian?: boolean): void;
    readInt32(littleEndian?: boolean): number;
    writeInt32(value: number, littleEndian?: boolean): void;
    readBytes(count: number): Uint8Array;
    writeBytes(bytes: number[] | Uint8Array): void;
    readHex(count: number, reverse?: boolean): string;
    readChars(count: number): string;
    writeChars(string: string): void;
    readWideChars(count: number): string;
}
