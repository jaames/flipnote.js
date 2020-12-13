/** datastream serves as a wrapper around the DataView API to help keep track of the offset into the stream */
/** @internal */
export const enum SeekOrigin {
  Begin,
  Current,
  End
};

/** @internal */
export class DataStream {

  public buffer: ArrayBuffer;
  public pointer: number;
  private data: DataView;

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

  public seek(offset: number, whence?: SeekOrigin) {
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

  public readUint8() {
    const val = this.data.getUint8(this.pointer);
    this.pointer += 1;
    return val;
  }

  public writeUint8(value: number) {
    this.data.setUint8(this.pointer, value);
    this.pointer += 1;
  }

  public readInt8() {
    const val = this.data.getInt8(this.pointer);
    this.pointer += 1;
    return val;
  }

  public writeInt8(value: number) {
    this.data.setInt8(this.pointer, value);
    this.pointer += 1;
  }

  public readUint16(littleEndian: boolean=true) {
    const val = this.data.getUint16(this.pointer, littleEndian);
    this.pointer += 2;
    return val;
  }

  public writeUint16(value: number, littleEndian: boolean=true) {
    this.data.setUint16(this.pointer, value, littleEndian);
    this.pointer += 2;
  }

  public readInt16(littleEndian: boolean=true) {
    const val = this.data.getInt16(this.pointer, littleEndian);
    this.pointer += 2;
    return val;
  }

  public writeInt16(value: number, littleEndian: boolean=true) {
    this.data.setInt16(this.pointer, value, littleEndian);
    this.pointer += 2;
  }

  public readUint32(littleEndian: boolean=true) {
    const val = this.data.getUint32(this.pointer, littleEndian);
    this.pointer += 4;
    return val;
  }
  
  public writeUint32(value: number, littleEndian: boolean=true) {
    this.data.setUint32(this.pointer, value, littleEndian);
    this.pointer += 4;
  }

  public readInt32(littleEndian: boolean=true) {
    const val = this.data.getInt32(this.pointer, littleEndian);
    this.pointer += 4;
    return val;
  }

  public writeInt32(value: number, littleEndian: boolean=true) {
    this.data.setInt32(this.pointer, value, littleEndian);
    this.pointer += 4;
  }

  public readBytes(count: number) {
    const bytes = new Uint8Array(this.data.buffer, this.pointer, count);
    this.pointer += bytes.byteLength;
    return bytes;
  }

  public writeBytes(bytes: number[] | Uint8Array) {
    bytes.forEach((byte: number) => this.writeUint8(byte));
  }

  public readHex(count: number, reverse: boolean=false) {
    const bytes = this.readBytes(count);
    let hex = [];
    for (let i = 0; i < bytes.length; i++) {
      hex.push(bytes[i].toString(16).padStart(2, '0'));
    }
    if (reverse)
      hex.reverse();
    return hex.join('').toUpperCase();
  }

  public readChars(count: number) {
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

  public writeChars(string: string) {
    for (let i = 0; i < string.length; i++) {
      const char = string.charCodeAt(i);
      this.writeUint8(char);
    }
  }

  public readWideChars(count: number) {
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