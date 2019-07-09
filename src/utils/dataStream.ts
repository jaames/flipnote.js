/** datastream serves as a wrapper around the DataView API to help keep track of the offset into the stream */
export enum SeekOrigin {
  Begin,
  Current,
  End
}

export class DataStream {

  public buffer: ArrayBuffer;
  private data: DataView;
  private cursor: number;

  constructor(arrayBuffer: ArrayBuffer) {
    this.buffer = arrayBuffer;
    this.data = new DataView(arrayBuffer);
    this.cursor = 0;
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
        this.cursor = this.data.byteLength + offset;
        break;
      case SeekOrigin.Current:
        this.cursor += offset;
        break;
      case SeekOrigin.Begin:
      default:
        this.cursor = offset;
        break;
    }
  }

  public readUint8() {
    var val = this.data.getUint8(this.cursor);
    this.cursor += 1;
    return val;
  }

  public writeUint8(value: number) {
    this.data.setUint8(this.cursor, value);
    this.cursor += 1;
  }

  public readInt8() {
    var val = this.data.getInt8(this.cursor);
    this.cursor += 1;
    return val;
  }

  public writeInt8(value: number) {
    this.data.setInt8(this.cursor, value);
    this.cursor += 1;
  }

  public readUint16(littleEndian: boolean=true) {
    var val = this.data.getUint16(this.cursor, littleEndian);
    this.cursor += 2;
    return val;
  }

  public writeUint16(value: number, littleEndian: boolean=true) {
    this.data.setUint16(this.cursor, value, littleEndian);
    this.cursor += 2;
  }

  public readInt16(littleEndian: boolean=true) {
    var val = this.data.getInt16(this.cursor, littleEndian);
    this.cursor += 2;
    return val;
  }

  public writeInt16(value: number, littleEndian: boolean=true) {
    this.data.setInt16(this.cursor, value, littleEndian);
    this.cursor += 2;
  }

  public readUint32(littleEndian: boolean=true) {
    var val = this.data.getUint32(this.cursor, littleEndian);
    this.cursor += 4;
    return val;
  }
  
  public writeUint32(value: number, littleEndian: boolean=true) {
    this.data.setUint32(this.cursor, value, littleEndian);
    this.cursor += 4;
  }

  public readInt32(littleEndian: boolean=true) {
    var val = this.data.getInt32(this.cursor, littleEndian);
    this.cursor += 4;
    return val;
  }

  public writeInt32(value: number, littleEndian: boolean=true) {
    this.data.setInt32(this.cursor, value, littleEndian);
    this.cursor += 4;
  }

  public readBytes(count: number) {
    var bytes = new Uint8Array(this.data.buffer, this.cursor, count);
    this.cursor += bytes.byteLength;
    return bytes;
  }

  public writeBytes(bytes: number[] | Uint8Array) {
    bytes.forEach((byte: number) => this.writeUint8(byte));
  }

  public readHex(count: number, reverse: boolean=false) {
    var bytes = this.readBytes(count);
    let hex = [];
    for (let i = 0; i < bytes.length; i++) {
      hex.push(bytes[i].toString(16).padStart(2, '0'));
    }
    if (reverse) hex.reverse();
    return hex.join('').toUpperCase();
  }

  public readUtf8(count: number) {
    var chars = this.readBytes(count);
    var str = '';
    for (let i = 0; i < chars.length; i++) {
      let char = chars[i];
      if (char == 0) break;
      str += String.fromCharCode(char);
    }
    return str;
  }

  public writeUtf8(string: string) {
    for (let i = 0; i < string.length; i++) {
      let char = string.charCodeAt(i);
      this.writeUint8(char);
    }
  }

  public readUtf16(count: number) {
    var chars = new Uint16Array(this.data.buffer, this.cursor, count);
    this.cursor += chars.byteLength;
    var str = '';
    for (let i = 0; i < chars.length; i++) {
      let char = chars[i];
      if (char == 0) break;
      str += String.fromCharCode(char);
    }
    return str;
  }
}