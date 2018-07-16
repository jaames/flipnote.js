/** file reader serves as a wrapper around the DataView API to help keep track of the offset into the file */
export default class fileReader {
  /**
  * Create a fileReader instance
  * @param {ArrayBuffer} arrayBuffer - data to read from
  */
  constructor(arrayBuffer) {
    this._data = new DataView(arrayBuffer);
    this._offset = 0;
  }

  /**
  * Get the length of the file
  * @returns {number}
  */
  get fileLength() {
    return this._data.byteLength;
  }

  /**
  * based on the seek method from Python's file objects - https://www.tutorialspoint.com/python/file_seek.htm
  * @param {number} offset - position of the read pointer within the file
  * @param {number} whence - (optional) defaults to absolute file positioning,
  *                          1 = offset is relative to the current position
  *                          2 = offset is relative to the file's end
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
  * Read an unsigned 8-bit integer from the file, and automatically increment the offset
  * @returns {number}
  */
  readUint8() {
    var val = this._data.getUint8(this._offset);
    this._offset += 1;
    return val;
  }

  /**
  * Read a signed 8-bit integer from the file, and automatically increment the offset
  * @returns {number}
  */
  readInt8() {
    var val = this._data.getInt8(this._offset);
    this._offset += 1;
    return val;
  }

  /**
  * Read an unsigned 16-bit integer from the file, and automatically increment the offset
  * @param {boolean} littleEndian - defaults to true, set to false to read data in big endian byte order
  * @returns {number}
  */
  readUint16(littleEndian=true) {
    var val = this._data.getUint16(this._offset, littleEndian);
    this._offset += 2;
    return val;
  }

  /**
  * Read a signed 16-bit integer from the file, and automatically increment the offset
  * @param {boolean} littleEndian - defaults to true, set to false to read data in big endian byte order
  * @returns {number}
  */
  readInt16(littleEndian=true) {
    var val = this._data.getInt16(this._offset, littleEndian);
    this._offset += 2;
    return val;
  }

  /**
  * Read an unsigned 32-bit integer from the file, and automatically increment the offset
  * @param {boolean} littleEndian - defaults to true, set to false to read data in big endian byte order
  * @returns {number}
  */
  readUint32(littleEndian=true) {
    var val = this._data.getUint32(this._offset, littleEndian);
    this._offset += 4;
    return val;
  }

  /**
  * Read a signed 32-bit integer from the file, and automatically increment the offset
  * @param {boolean} littleEndian - defaults to true, set to false to read data in big endian byte order
  * @returns {number}
  */
  readInt32(littleEndian=true) {
    var val = this._data.getInt32(this._offset, littleEndian);
    this._offset += 4;
    return val;
  }

  readUtf8(length) {
    var chars = new Uint8Array(this._data.buffer, this._offset, length);
    var val = "";
    for (let i = 0; i < chars.length; i++) {
      val += String.fromCharCode(chars[i]);
    }
    this._offset += chars.length;
    return val;
  }
}