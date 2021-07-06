/** @internal */
export declare class ByteArray {
    pageSize: number;
    allocSize: number;
    realSize: number;
    pages: Uint8Array[];
    numPages: number;
    pageIdx: number;
    pagePtr: number;
    realPtr: number;
    constructor();
    set pointer(ptr: number);
    get pointer(): number;
    newPage(): void;
    setPointer(ptr: number): void;
    writeByte(value: number): void;
    writeBytes(bytes: Uint8Array | number[], srcPtr?: number, length?: number): void;
    writeChars(str: string): void;
    writeU8(value: number): void;
    writeU16(value: number): void;
    writeU32(value: number): void;
    getBytes(): Uint8Array;
    getBuffer(): ArrayBufferLike;
}
