/** datastream serves as a wrapper around the DataView API to help keep track of the offset into the stream */
export default class dataStream {
  /**
  * Create a fileReader instance
  * @param {ArrayBuffer} arrayBuffer - data to read from
  */
  constructor(arrayBuffer) {
    this.buffer = arrayBuffer;
    this._data = new DataView(arrayBuffer);
    this._offset = 0;
  }

  get bytes() {
    return new Uint8Array(this.buffer);
  }

  /**
  * Get the length of the stream
  * @returns {number}
  */
  get byteLength() {
    return this._data.byteLength;
  }

  /**
  * based on the seek method from Python's file objects - https://www.tutorialspoint.com/python/file_seek.htm
  * @param {number} offset - position of the read pointer within the stream
  * @param {number} whence - (optional) defaults to absolute file positioning,
  *                          1 = offset is relative to the current position
  *                          2 = offset is relative to the stream's end
  */
  seek(offset, whence) {
    switch (whence) {
      case 2:
        this._offset = this._data.byteLength + offset;
        break;
      case 1:
        this._offset += offset;
        break;
      case 0:
      default:
        this._offset = offset;
        break;
    }
  }

  /**
  * Read an unsigned 8-bit integer from the stream, and automatically increment the offset
  * @returns {number}
  */
  readUint8() {
    var val = this._data.getUint8(this._offset);
    this._offset += 1;
    return val;
  }

  /**
  * Write an unsigned 8-bit integer to the stream, and automatically increment the offset
  * @param {number} value - value to write
  */
  writeUint8(value) {
    this._data.setUint8(this._offset, value);
    this._offset += 1;
  }

  /**
  * Read a signed 8-bit integer from the stream, and automatically increment the offset
  * @returns {number}
  */
  readInt8() {
    var val = this._data.getInt8(this._offset);
    this._offset += 1;
    return val;
  }

  /**
  * Write a signed 8-bit integer to the stream, and automatically increment the offset
  * @param {number} value - value to write
  */
  writeInt8(value) {
    this._data.setInt8(this._offset, value);
    this._offset += 1;
  }

  /**
  * Read an unsigned 16-bit integer from the stream, and automatically increment the offset
  * @param {boolean} littleEndian - defaults to true, set to false to read data in big endian byte order
  * @returns {number}
  */
  readUint16(littleEndian=true) {
    var val = this._data.getUint16(this._offset, littleEndian);
    this._offset += 2;
    return val;
  }

  /**
  * Write an unsigned 16-bit integer to the stream, and automatically increment the offset
  * @param {number} value - value to write
  * @param {boolean} littleEndian - defaults to true, set to false to write data in big endian byte order
  */
  writeUint16(value, littleEndian=true) {
    this._data.setUint16(this._offset, value, littleEndian);
    this._offset += 2;
  }

  /**
  * Read a signed 16-bit integer from the stream, and automatically increment the offset
  * @param {boolean} littleEndian - defaults to true, set to false to read data in big endian byte order
  * @returns {number}
  */
  readInt16(littleEndian=true) {
    var val = this._data.getInt16(this._offset, littleEndian);
    this._offset += 2;
    return val;
  }

  /**
  * Write a signed 16-bit integer to the stream, and automatically increment the offset
  * @param {number} value - value to write
  * @param {boolean} littleEndian - defaults to true, set to false to write data in big endian byte order
  */
  writeInt16(value, littleEndian=true) {
    this._data.setInt16(this._offset, value, littleEndian);
    this._offset += 2;
  }

  /**
  * Read an unsigned 32-bit integer from the stream, and automatically increment the offset
  * @param {boolean} littleEndian - defaults to true, set to false to read data in big endian byte order
  * @returns {number}
  */
  readUint32(littleEndian=true) {
    var val = this._data.getUint32(this._offset, littleEndian);
    this._offset += 4;
    return val;
  }

  /**
  * Write an unsigned 32-bit integer to the stream, and automatically increment the offset
  * @param {number} value - value to write
  * @param {boolean} littleEndian - defaults to true, set to false to write data in big endian byte order
  */
  writeUint32(value, littleEndian=true) {
    this._data.setUint32(this._offset, value, littleEndian);
    this._offset += 4;
  }

  /**
  * Read a signed 32-bit integer from the stream, and automatically increment the offset
  * @param {boolean} littleEndian - defaults to true, set to false to read data in big endian byte order
  * @returns {number}
  */
  readInt32(littleEndian=true) {
    var val = this._data.getInt32(this._offset, littleEndian);
    this._offset += 4;
    return val;
  }

  /**
  * Write a signed 32-bit integer to the stream, and automatically increment the offset
  * @param {number} value - value to write
  * @param {boolean} littleEndian - defaults to true, set to false to write data in big endian byte order
  */
  writeInt32(value, littleEndian=true) {
    this._data.setInt32(this._offset, value, littleEndian);
    this._offset += 4;
  }

  /**
  * Read bytes and return an array
  * @param {number} count - number of bytes to read
  * @returns {Uint8Array}
  */
  readBytes(count) {
    var bytes = new Uint8Array(this._data.buffer, this._offset, count);
    this._offset += bytes.byteLength;
    return bytes;
  }

  /**
  * Write bytes from an array
  * @param {Array} bytes - array of byte values
  * @returns {Uint8Array}
  */
  writeBytes(bytes) {
    bytes.forEach(byte => this.writeUint8(byte));
  }

  /**
  * Read bytes and return a hex string
  * @param {number} count - number of bytes to read
  * @param {bool} reverse - pass true to reverse byte order
  * @returns {string}
  */
  readHex(count, reverse=false) {
    var bytes = this.readBytes(count);
    let hex = [];
    for (let i = 0; i < bytes.length; i++) {
      hex.push(bytes[i].toString(16).padStart(2, "0"));
    }
    if (reverse) hex.reverse();
    return hex.join("").toUpperCase();
  }

  /**
  * Read (simple) utf8 string
  * @param {number} count - number of characters to read
  * @returns {string}
  */
  readUtf8(count) {
    var chars = this.readBytes(count);
    var str = "";
    for (let i = 0; i < chars.length; i++) {
      let char = chars[i];
      if (char == 0) break;
      str += String.fromCharCode(char);
    }
    return str;
  }

  /**
  * Write (simple) utf8 string
  * @param {string} string - string to write
  */
  writeUtf8(string) {
    for (let i = 0; i < string.length; i++) {
      let char = string.charCodeAt(i);
      this.writeUint8(char);
    }
  }

  /**
  * Read (simple) utf16 string
  * @param {number} count - number of characters to read
  * @returns {string}
  */
  readUtf16(count) {
    var chars = new Uint16Array(this._data.buffer, this._offset, count);
    this._offset += chars.byteLength;
    var str = "";
    for (let i = 0; i < chars.length; i++) {
      let char = chars[i];
      if (char == 0) break;
      str += String.fromCharCode(char);
    }
    return str;
  }
}