import { hexFromBytes } from './hex';

/**
 * @internal
 */
export const enum SeekOrigin {
  Begin,
  Current,
  End
};

/** 
 * Wrapper around the DataView API to keep track of the offset into the data,
 * also provides some utils for reading ascii strings etc.
 * @internal
 */
export class DataStream {

  /**
  * @internal
  */
  buffer: ArrayBuffer;
  /**
  * @internal
  */
  pointer: number;
  /**
  * @internal
  */
  data: DataView;

  constructor(buffer: ArrayBuffer) {
    this.buffer = buffer;
    this.data = new DataView(buffer);
    this.pointer = 0;
  }

  /**
   * Returns the data as an Uint8Array of bytes.
   */
  get bytes() {
    return new Uint8Array(this.buffer);
  }

  /**
   * Returns the total number of bytes in the data.
   */
  get numBytes() {
    return this.data.byteLength;
  }

  /**
   * @internal
   */
  seek(offset: number, whence?: SeekOrigin) {
    switch (whence) {
      case SeekOrigin.End:
        this.pointer = this.data.byteLength + offset;
        break;
      case SeekOrigin.Current:
        this.pointer += offset;
        break;
      case SeekOrigin.Begin:
      default:
        this.pointer = offset;
        break;
    }
  }

  /**
   * @internal
   */
  readUint8() {
    const val = this.data.getUint8(this.pointer);
    this.pointer += 1;
    return val;
  }

  /**
   * @internal
   */
  writeUint8(value: number) {
    this.data.setUint8(this.pointer, value);
    this.pointer += 1;
  }

  /**
   * @internal
   */
  readInt8() {
    const val = this.data.getInt8(this.pointer);
    this.pointer += 1;
    return val;
  }

  /**
   * @internal
   */
  writeInt8(value: number) {
    this.data.setInt8(this.pointer, value);
    this.pointer += 1;
  }

  /**
   * @internal
   */
  readUint16(littleEndian=true) {
    const val = this.data.getUint16(this.pointer, littleEndian);
    this.pointer += 2;
    return val;
  }

  /**
   * @internal
   */
  writeUint16(value: number, littleEndian=true) {
    this.data.setUint16(this.pointer, value, littleEndian);
    this.pointer += 2;
  }

  /**
   * @internal
   */
  readInt16(littleEndian=true) {
    const val = this.data.getInt16(this.pointer, littleEndian);
    this.pointer += 2;
    return val;
  }

  /**
   * @internal
   */
  writeInt16(value: number, littleEndian=true) {
    this.data.setInt16(this.pointer, value, littleEndian);
    this.pointer += 2;
  }

  /**
   * @internal
   */
  readUint32(littleEndian=true) {
    const val = this.data.getUint32(this.pointer, littleEndian);
    this.pointer += 4;
    return val;
  }
  
  /**
   * @internal
   */
  writeUint32(value: number, littleEndian=true) {
    this.data.setUint32(this.pointer, value, littleEndian);
    this.pointer += 4;
  }

  /**
   * @internal
   */
  readInt32(littleEndian=true) {
    const val = this.data.getInt32(this.pointer, littleEndian);
    this.pointer += 4;
    return val;
  }

  /**
   * @internal
   */
  writeInt32(value: number, littleEndian=true) {
    this.data.setInt32(this.pointer, value, littleEndian);
    this.pointer += 4;
  }

  /**
   * @internal
   */
  readBytes(count: number) {
    const bytes = new Uint8Array(this.data.buffer, this.pointer, count);
    this.pointer += bytes.byteLength;
    return bytes;
  }

  /**
   * @internal
   */
  writeBytes(bytes: number[] | Uint8Array) {
    bytes.forEach((byte: number) => this.writeUint8(byte));
  }

  /**
   * @internal
   */
  readHex(count: number, reverse=false) {
    const bytes = this.readBytes(count);
    return hexFromBytes(bytes, reverse);
  }

  /**
   * @internal
   */
  readChar() {
    const char = this.readUint8();
    return String.fromCharCode(char);
  }

  /**
   * @internal
   */
  readWideChar() {
    const char = this.readUint16();
    return String.fromCharCode(char);
  }

  /**
   * @internal
   */
  readChars(count: number) {
    const chars = this.readBytes(count);
    let str = '';
    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
      if (char === 0)
        break;
      str += String.fromCharCode(char);
    }
    return str;
  }

  /**
   * @internal
   */
  writeChars(string: string) {
    for (let i = 0; i < string.length; i++) {
      const char = string.charCodeAt(i);
      this.writeUint8(char);
    }
  }

  /**
   * @internal
   */
  readWideChars(count: number) {
    const chars = new Uint16Array(this.data.buffer, this.pointer, count);
    let str = '';
    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
      if (char == 0)
        break;
      str += String.fromCharCode(char);
    }
    this.pointer += chars.byteLength;
    return str;
  }

  end() {
    return this.pointer >= this.data.byteLength;
  }
}