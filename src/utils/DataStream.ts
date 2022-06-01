/** @internal */
export const enum SeekOrigin {
  Begin,
  Current,
  End
};

/** 
 * Wrapper around the DataView API to keep track of the offset into the data
 * also provides some utils for reading ascii strings etc
 * @internal
 */
export class DataStream {

  buffer: ArrayBuffer;
  pointer: number;
  data: DataView;

  constructor(arrayBuffer: ArrayBuffer) {
    this.buffer = arrayBuffer;
    this.data = new DataView(arrayBuffer);
    this.pointer = 0;
  }

  get bytes() {
    return new Uint8Array(this.buffer);
  }

  get byteLength() {
    return this.data.byteLength;
  }

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

  readUint8() {
    const val = this.data.getUint8(this.pointer);
    this.pointer += 1;
    return val;
  }

  writeUint8(value: number) {
    this.data.setUint8(this.pointer, value);
    this.pointer += 1;
  }

  readInt8() {
    const val = this.data.getInt8(this.pointer);
    this.pointer += 1;
    return val;
  }

  writeInt8(value: number) {
    this.data.setInt8(this.pointer, value);
    this.pointer += 1;
  }

  readUint16(littleEndian=true) {
    const val = this.data.getUint16(this.pointer, littleEndian);
    this.pointer += 2;
    return val;
  }

  writeUint16(value: number, littleEndian=true) {
    this.data.setUint16(this.pointer, value, littleEndian);
    this.pointer += 2;
  }

  readInt16(littleEndian=true) {
    const val = this.data.getInt16(this.pointer, littleEndian);
    this.pointer += 2;
    return val;
  }

  writeInt16(value: number, littleEndian=true) {
    this.data.setInt16(this.pointer, value, littleEndian);
    this.pointer += 2;
  }

  readUint32(littleEndian=true) {
    const val = this.data.getUint32(this.pointer, littleEndian);
    this.pointer += 4;
    return val;
  }
  
  writeUint32(value: number, littleEndian=true) {
    this.data.setUint32(this.pointer, value, littleEndian);
    this.pointer += 4;
  }

  readInt32(littleEndian=true) {
    const val = this.data.getInt32(this.pointer, littleEndian);
    this.pointer += 4;
    return val;
  }

  writeInt32(value: number, littleEndian=true) {
    this.data.setInt32(this.pointer, value, littleEndian);
    this.pointer += 4;
  }

  readBytes(count: number) {
    const bytes = new Uint8Array(this.data.buffer, this.pointer, count);
    this.pointer += bytes.byteLength;
    return bytes;
  }

  writeBytes(bytes: number[] | Uint8Array) {
    bytes.forEach((byte: number) => this.writeUint8(byte));
  }

  readHex(count: number, reverse=false) {
    const bytes = this.readBytes(count);
    let hex = [];
    for (let i = 0; i < bytes.length; i++) {
      hex.push(bytes[i].toString(16).padStart(2, '0'));
    }
    if (reverse) hex.reverse();
    return hex.join('').toUpperCase();
  }

  readChars(count: number) {
    const chars = this.readBytes(count);
    let str = '';
    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
      if (char === 0) break;
      str += String.fromCharCode(char);
    }
    return str;
  }

  writeChars(string: string) {
    for (let i = 0; i < string.length; i++) {
      const char = string.charCodeAt(i);
      this.writeUint8(char);
    }
  }

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
}